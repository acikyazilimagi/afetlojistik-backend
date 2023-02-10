import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';
import { AWSSNSService } from 'src/notification/notification';
import { AuthSMS, AuthSMSSchema } from './schemas/auth.sms.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: AuthSMS.name, schema: AuthSMSSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AWSSNSService],
  exports: [UserService],
})
export class UserModule {}
