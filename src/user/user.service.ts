import {
  LoginResponse,
  UserStatuses,
  ValidateVerificationCodeResponse,
} from './types';
import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { PinoLogger } from 'nestjs-pino';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './schemas/user.schema';
import UserNotFoundException from './exceptions/user-not-found.exception';
import { LogMe } from '../common/decorators/log.decorator';
import { AWSSNSService } from 'src/notification/services/aws-sns.service';
import { AuthSMS } from './schemas/auth.sms.schema';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Organization } from 'src/organization/schemas/organization.schema';
import UserCanNotBeActivatedException from './exceptions/user-can-not-be-activated.exception';
import PhoneNumberAlreadyExistsException from './exceptions/phone-number-already-exists.exception';
import InvalidVerificationCodeException from './exceptions/invalid-verification-code.exception';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  saltRounds = 10;
  constructor(
    private readonly logger: PinoLogger,
    private readonly snsService: AWSSNSService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(AuthSMS.name)
    private readonly authSMSModel: Model<AuthSMS>,
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<Organization>
  ) {}

  @LogMe()
  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { phone } = loginUserDto;

    const user = await this.userModel.findOne({ phone });
    if (!user) return { success: true };

    const {
      success: isSmsSend,
      verificationCode,
      message,
    } = await this.sendVerificationCode(phone);

    if (!isSmsSend) return { success: false };

    const authSmsDocument = await this.authSMSModel.findOne({ phone }).lean();
    if (authSmsDocument?.smsCount >= 5) return { success: true };

    await this.authSMSModel
      .updateOne(
        { phone },
        {
          $set: { verificationCode, message },
          $inc: { smsCount: 1 },
        },
        { upsert: true }
      )
      .lean();

    return { success: true };
  }

  @LogMe()
  async sendVerificationCode(phone: string): Promise<{
    success: boolean;
    verificationCode: number;
    message: string;
  }> {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const bcryptSecret = this.configService.get('bcrypt.secret');
    const hashedVerificationCode = await hash(
      verificationCode.toString() + bcryptSecret,
      this.saltRounds
    );
    const messageBody = `Doğrulama kodunuz: ${verificationCode}`;
    const isSmsSent = await this.snsService.sendSMS('+90' + phone, messageBody);

    return {
      success: isSmsSent,
      verificationCode: hashedVerificationCode,
      message: messageBody,
    };
  }

  @LogMe()
  async getUserById(id: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(id);

    if (!user) throw new UserNotFoundException();

    return user as unknown as UserDocument;
  }

  @LogMe()
  async validateVerificationCode({
    phone,
    code: enteredCode,
  }: VerifyOtpDto): Promise<ValidateVerificationCodeResponse> {
    const authSMSDocument = await this.authSMSModel.findOne({ phone });

    if (!authSMSDocument) throw new InvalidVerificationCodeException();

    const verificationCode = authSMSDocument.verificationCode.toString();
    const bypassCode = this.configService.get('debug.bypassCode');

    const bcryptSecret = this.configService.get('bcrypt.secret');
    const isCodeValid = await compare(
      enteredCode + bcryptSecret,
      verificationCode
    );

    if (!isCodeValid && enteredCode !== bypassCode)
      throw new InvalidVerificationCodeException();

    let user = await this.userModel.findOne({ phone });
    if (!user) throw new InvalidVerificationCodeException();

    const payload = { id: user.id, organizationId: user.organizationId };
    const access_token = this.jwtService.sign(payload);

    await authSMSDocument?.delete();

    if (user.status !== UserStatuses.VERIFIED) {
      user = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            status: UserStatuses.VERIFIED,
          },
        },
        { new: true }
      );
    }

    return {
      user,
      token: access_token,
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

    if (!user) return { success: true };
    const authSmsDocument = await this.authSMSModel.findOne({ phone });

    if (authSmsDocument.smsCount >= 5) return { success: true };

    const {
      success: isSmsSent,
      verificationCode,
      message,
    } = await this.sendVerificationCode(phone);

    if (!isSmsSent) return { success: true };

    await this.authSMSModel.updateOne(
      {
        phone,
      },
      {
        $set: { verificationCode, message },
        $inc: { smsCount: 1 },
      }
    );

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
  async getAll(): Promise<UserDocument[]> {
    const users: UserDocument[] = await this.userModel.find();

    return users as unknown as UserDocument[];
  }

  @LogMe()
  async update(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserDocument> {
    const user = await this.getUserById(userId);

    if (user.status === UserStatuses.PENDING && updateUserDto.active) {
      throw new UserCanNotBeActivatedException();
    }

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

    const userWithPhoneNumber = await this.userModel.findOne({
      phone: createUserDto.phone,
    });

    if (userWithPhoneNumber) {
      throw new PhoneNumberAlreadyExistsException();
    }

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

  @LogMe()
  async getUserByPhone(phone: string): Promise<User> {
    return this.userModel.findOne({ phone });
  }
}
