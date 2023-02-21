import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Model, Types } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { AWSSNSService } from 'src/notification/services/aws-sns.service';
import {
  Organization,
  OrganizationDocument,
} from 'src/organization/schemas/organization.schema';
import { LogMe } from '../common/decorators/log.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import InvalidVerificationCodeException from './exceptions/invalid-verification-code.exception';
import PhoneNumberAlreadyExistsException from './exceptions/phone-number-already-exists.exception';
import UserCanNotBeActivatedException from './exceptions/user-can-not-be-activated.exception';
import UserNotFoundException from './exceptions/user-not-found.exception';
import { AuthSMS, AuthSMSDocument } from './schemas/auth.sms.schema';
import { User, UserDocument } from './schemas/user.schema';
import { UserStatuses } from './types';

@Injectable()
export class UserService {
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
  async getUserById(id: string): Promise<{ user: UserDocument }> {
    const user = await this.userModel.findById(id);

    if (!user) throw new UserNotFoundException();

    return { user };
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

  @LogMe()
  async getUsersByIds(userIds: string[]): Promise<{ users: UserDocument[] }> {
    const users = await this.userModel
      .find({
        _id: { $in: userIds },
      })
      .select('-password -organizationId');

    return { users };
  }

  @LogMe()
  async getAll(): Promise<{ users: UserDocument[] }> {
    const users = await this.userModel.find();

    return { users };
  }

  @LogMe()
  async update(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<{ user: UserDocument }> {
    const { user } = await this.getUserById(userId);

    if (user.status === UserStatuses.PENDING && updateUserDto.active) {
      throw new UserCanNotBeActivatedException();
    }

    const userUpdated = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          ...updateUserDto,
        },
      },
      { new: true }
    );

    return { user: userUpdated };
  }

  validateUser() {
    return;
  }

  @LogMe()
  async create(createUserDto: CreateUserDto): Promise<{ user: UserDocument }> {
    // TODO: implement validation rules
    // this.validateUser(createUserDto);
    // TODO: check is null or not

    const organization = await this.organizationModel.findOne();

    const { phone } = createUserDto;

    const userWithPhoneNumber = await this.userModel.findOne({
      phone: createUserDto.phone,
    });

    if (userWithPhoneNumber) {
      throw new PhoneNumberAlreadyExistsException();
    }

    // TODO: seperate verificationCode generation as utility
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

    const newUser = await new this.userModel({
      ...createUserDto,
      status: UserStatuses.PENDING,
      organizationId: organization.id,
    }).save();

    return { user: newUser };
  }

  @LogMe()
  async getUserByPhone(phone: string): Promise<{ user: UserDocument }> {
    const user = await this.userModel.findOne({ phone });

    return { user };
  }

  @LogMe()
  async filterUsers(filterUserDto: FilterUserDto): Promise<{
    total: number;
    data: UserDocument[];
  }> {
    const match = {
      ...(filterUserDto.ids
        ? {
            _id: { $in: filterUserDto.ids.map((id) => new Types.ObjectId(id)) },
          }
        : undefined),
      ...(filterUserDto.name
        ? { name: new RegExp(filterUserDto.name) }
        : undefined),
      ...(filterUserDto.surname
        ? { surname: new RegExp(filterUserDto.surname) }
        : undefined),
      ...(filterUserDto.phone
        ? { phone: new RegExp(filterUserDto.phone) }
        : undefined),
      ...(filterUserDto.email
        ? { email: new RegExp(filterUserDto.email) }
        : undefined),
      ...(filterUserDto.statuses
        ? { status: { $in: filterUserDto.statuses } }
        : undefined),
      ...(filterUserDto.isAdmin
        ? { isAdmin: { $in: filterUserDto.isAdmin } }
        : undefined),
      ...(filterUserDto.activeness
        ? { active: { $in: filterUserDto.activeness } }
        : undefined),
      ...{ organizationId: filterUserDto.organizationId },
    };

    const query = this.userModel.aggregate();
    query.match(match);

    query.sort({ createdAt: -1 });

    query.facet({
      total: [{ $count: 'total' }],
      data: [
        { $skip: filterUserDto.skip || 0 },
        { $limit: filterUserDto.limit || Number.MAX_SAFE_INTEGER },
      ],
    });

    query.project({
      total: { $arrayElemAt: ['$total.total', 0] },
      data: 1,
    });

    const [{ data: users, total }] = await query.exec();

    if (!users.length) {
      return {
        data: [],
        total: 0,
      };
    }

    return {
      data: users,
      total,
    };
  }
}
