import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';
import { AuthSMS, AuthSMSSchema } from './schemas/auth.sms.schema';
import { NotificationModule } from '../notification/notification.module';
import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schemas/organization.schema';
import { jwtConstants } from 'src/constants';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: AuthSMS.name, schema: AuthSMSSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    NotificationModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
