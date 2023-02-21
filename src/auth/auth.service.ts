import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { AWSSNSService } from 'src/notification/services/aws-sns.service';
import {
  Organization,
  OrganizationDocument,
} from 'src/organization/schemas/organization.schema';
import { AuthSMS, AuthSMSDocument, User, UserDocument } from 'src/user/schemas';
import { UserStatuses } from 'src/user/types';
import { LogMe } from '../common/decorators/log.decorator';
import { LoginUserDto, VerifyOtpDto } from './dto';
import { InvalidVerificationCodeException } from './exceptions/invalid-verification-code.exception';

@Injectable()
export class AuthService {
  saltRounds = 10;
  constructor(
    private readonly logger: PinoLogger,
    private readonly snsService: AWSSNSService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(AuthSMS.name)
    private readonly authSMSModel: Model<AuthSMSDocument>,
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>
  ) {}

  @LogMe()
  private async sendVerificationCode(phone: string): Promise<{
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
  async login(loginUserDto: LoginUserDto): Promise<{ success: boolean }> {
    const { phone } = loginUserDto;

    const user = await this.userModel.findOne({ phone });
    if (!user) return { success: true };

    const {
      success: isSmsSent,
      verificationCode,
      message,
    } = await this.sendVerificationCode(phone);

    if (!isSmsSent) return { success: false };

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
  async validateVerificationCode({
    phone,
    code: enteredCode,
  }: VerifyOtpDto): Promise<{ user: Partial<User>; token: string }> {
    const bypassCode = this.configService.get('debug.bypassCode');
    const bcryptSecret = this.configService.get('bcrypt.secret');

    const authSMSDocument = await this.authSMSModel.findOne({ phone });
    if (!authSMSDocument) throw new InvalidVerificationCodeException();

    const verificationCode = authSMSDocument.verificationCode;
    const isCodeValid = await compare(
      enteredCode + bcryptSecret,
      verificationCode
    );

    if (!isCodeValid && enteredCode !== bypassCode)
      throw new InvalidVerificationCodeException();

    const user = await this.userModel.findOne({ phone });
    if (!user) throw new InvalidVerificationCodeException();

    await authSMSDocument.delete();

    if (user.status !== UserStatuses.VERIFIED) {
      const userVerified = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            status: UserStatuses.VERIFIED,
          },
        },
        { new: true }
      );

      const payload = {
        id: userVerified.id,
        organizationId: userVerified.organizationId,
      };
      const access_token = this.jwtService.sign(payload);

      return {
        user: userVerified,
        token: access_token,
      };
    } else {
      const payload = { id: user.id, organizationId: user.organizationId };
      const access_token = this.jwtService.sign(payload);

      return {
        user,
        token: access_token,
      };
    }
  }

  @LogMe()
  async resendVerificationCode({
    phone,
  }: {
    phone: string;
  }): Promise<{ success: boolean }> {
    // TODO: check is null or not
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
}
