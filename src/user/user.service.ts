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
import { LoginResponse, ValidateVerificationCodeResponse } from './types';
import { AWSSNSService } from 'src/notification/notification';
import { AuthSMS, AuthSMSDocument } from './schemas/auth.sms.schema';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';

function generateToken(len = 64) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < len; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

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
    private readonly authSMSModel: Model<AuthSMS>
  ) {}
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
      (await new this.authSMSModel({
        ...loginUserDto,
        phone: phone,
        message: messageBody,
        verificationCode,
      }).save()) as unknown as AuthSMSDocument;
    }

    const token = generateToken();

    await this.tokenModel.deleteOne({
      userId: user._id,
    });

    await this.tokenModel.create({
      userId: user._id,
      token,
    });

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
    verificationCode: string
  ): Promise<ValidateVerificationCodeResponse> {
    const authSMSDocument = await this.authSMSModel.findOne({
      verificationCode,
    });

    if (!authSMSDocument) {
      throw new UserNotFoundException();
    }

    const user = await this.userModel.findOne({
      phone: authSMSDocument.phone,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

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
    return this.login(resendVerificationCodeDto);
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
}
