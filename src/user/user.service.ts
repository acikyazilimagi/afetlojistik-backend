import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import UserNotFoundException from './exceptions/user-not-found.exception';
import { WrongCredentialsException } from './exceptions/wrong-credentials.exception';
import { Token, TokenDocument } from './schemas/token.schema';
import { LogMe } from '../common/decorators/log.decorator';
import InvalidTokenException from './exceptions/invalid-token.exception';
import { LoginResponse } from './types';

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
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<Token>
  ) {}
  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { phone, password } = loginUserDto;

    const user = await this.userModel.findOne({
      phone,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new WrongCredentialsException();
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
  async getUsersByIds(userIds: string[]): Promise<UserDocument[]> {
    return this.userModel
      .find({
        _id: { $in: userIds },
      })
      .select('-password -organizationId')
      .lean();
  }
}
