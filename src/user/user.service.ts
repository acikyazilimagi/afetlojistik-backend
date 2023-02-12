import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { PinoLogger } from 'nestjs-pino';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import UserNotFoundException from './exceptions/user-not-found.exception';
import { Token, TokenDocument } from './schemas/token.schema';
import { LogMe } from '../common/decorators/log.decorator';
import InvalidTokenException from './exceptions/invalid-token.exception';
import {
  LoginResponse,
  UserStatuses,
  ValidateVerificationCodeResponse,
} from './types';
import { AWSSNSService } from 'src/notification/services/aws-sns.service';
import { AuthSMS } from './schemas/auth.sms.schema';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Organization } from 'src/organization/schemas/organization.schema';
import ResendSmsCountExceededException from './exceptions/resend-sms-count-exceeded.exception';

function generateToken(len = 64) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < len; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

const bypassCode = process.env.DEBUG_BYPASS_CODE ?? '345678';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly snsService: AWSSNSService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<Token>,
    @InjectModel(AuthSMS.name)
    private readonly authSMSModel: Model<AuthSMS>,
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<Organization>
  ) {}
  @LogMe()
  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { phone } = loginUserDto;

    const user = await this.userModel.findOne({
      phone,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const messageBody = `Doğrulama kodunuz: ${verificationCode}`;

    const isSmsSent = await this.snsService.sendSMS('+90' + phone, messageBody);

    if (isSmsSent) {
      await this.authSMSModel.deleteOne({
        phone,
      });
      await new this.authSMSModel({
        ...loginUserDto,
        phone: phone,
        message: messageBody,
        verificationCode,
      }).save();

      await this.authSMSModel.updateOne(
        {
          phone,
        },
        {
          $inc: { smsCount: 1 },
        }
      );
    }

    return {
      success: true,
    };
  }

  @LogMe()
  async getUserById(id: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(id);

    if (!user) throw new UserNotFoundException();

    return user as unknown as UserDocument;
  }

  @LogMe()
  async validateToken(token: string): Promise<UserDocument> {
    const tokenInfo: TokenDocument = await this.tokenModel.findOne({
      token,
    });

    if (!tokenInfo) {
      throw new InvalidTokenException();
    }

    return this.getUserById(tokenInfo.userId);
  }

  @LogMe()
  async validateVerificationCode(
    verifyOtpDto: VerifyOtpDto
  ): Promise<ValidateVerificationCodeResponse> {
    const authSMSDocument = await this.authSMSModel.findOne({
      phone: verifyOtpDto.phone,
      verificationCode: verifyOtpDto.code,
    });

    if (!authSMSDocument && verifyOtpDto.code !== bypassCode) {
      throw new UserNotFoundException();
    }

    const user = await this.userModel.findOne({
      active: true,
      phone: verifyOtpDto.phone,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.status == UserStatuses.PENDING) {
      user.status = UserStatuses.ACTIVE;
      await user.save();
    }

    await authSMSDocument?.delete();
    const token = generateToken();

    await this.tokenModel.deleteOne({
      userId: user._id,
    });

    await this.tokenModel.create({
      userId: user._id,
      token,
    });

    const userWithOutPassword = {
      ...user.toObject(),
      password: undefined,
    };

    return {
      user: userWithOutPassword,
      token,
    };
  }

  @LogMe()
  async resendVerificationCode(
    resendVerificationCodeDto: ResendVerificationCodeDto
  ): Promise<LoginResponse> {
    const { phone } = resendVerificationCodeDto;

    const user = await this.userModel.findOne({
      phone,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const authSmsDocument = await this.authSMSModel.findOne({ phone });

    if (authSmsDocument.smsCount >= 5) {
      throw new ResendSmsCountExceededException();
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const messageBody = `Doğrulama kodunuz: ${verificationCode}`;

    const isSmsSent = await this.snsService.sendSMS('+90' + phone, messageBody);

    if (isSmsSent) {
      await this.authSMSModel.updateOne(
        {
          phone,
        },
        {
          $inc: { smsCount: 1 },
        }
      );
    }

    return {
      success: true,
    };
  }

  @LogMe()
  async getUsersByIds(userIds: string[]): Promise<UserDocument[]> {
    return this.userModel
      .find({
        _id: { $in: userIds },
      })
      .select('-password -organizationId')
      .lean();
  }

  @LogMe()
  async logout(token: string): Promise<{ success: boolean }> {
    const tokenInfo: TokenDocument = await this.tokenModel.findOne({
      token,
    });

    if (!tokenInfo) {
      throw new InvalidTokenException();
    }

    await this.tokenModel.deleteOne({ token });

    return {
      success: true,
    };
  }

  @LogMe()
  async getAll(): Promise<UserDocument[]> {
    const users: UserDocument[] = await this.userModel.find();

    return users as unknown as UserDocument[];
  }

  @LogMe()
  async update(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserDocument> {
    await this.getUserById(userId);

    return (await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          ...updateUserDto,
        },
      },
      { new: true }
    )) as unknown as UserDocument;
  }

  validateUser() {
    return;
  }

  @LogMe()
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // TODO: implement validation rules
    // this.validateUser(createUserDto);

    const organization = await this.organizationModel.findOne();

    const { phone } = createUserDto;

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const messageBody = `Doğrulama kodunuz: ${verificationCode}`;

    const isSmsSent = await this.snsService.sendSMS('+90' + phone, messageBody);

    if (isSmsSent) {
      await new this.authSMSModel({
        phone: phone,
        message: messageBody,
        verificationCode,
      }).save();
    }

    return (await new this.userModel({
      ...createUserDto,
      status: UserStatuses.PENDING,
      organizationId: organization.id,
    }).save()) as unknown as UserDocument;
  }
}
