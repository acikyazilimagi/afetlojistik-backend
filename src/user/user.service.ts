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

function generateToken(n) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

@Injectable()
export class UserService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(User.name)
    private readonly userDocument: Model<UserDocument>,
    @InjectModel(Token.name)
    private readonly tokenDocument: Model<TokenDocument>
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const { phone, password } = loginUserDto;

    const user = await this.userDocument.findOne({
      phone,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new WrongCredentialsException();
    }

    const token = generateToken(64);

    await this.tokenDocument.deleteOne({
      userId: user._id,
    });

    await this.tokenDocument.create({
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
  async validateToken(token: string) {
    const tokenInfo = await this.tokenDocument.findOne({
      token,
    });

    if (!tokenInfo) {
      throw new InvalidTokenException();
    }

    const user = await this.userDocument.findById(tokenInfo.userId);

    if (!user.active) throw new InvalidTokenException();

    return user;
  }
}
