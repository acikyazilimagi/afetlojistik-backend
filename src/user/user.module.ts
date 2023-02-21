import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schemas/organization.schema';
import { NotificationModule } from '../notification/notification.module';
import { AuthSMS, AuthSMSSchema, User, UserSchema } from './schemas';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthSMS.name, schema: AuthSMSSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    NotificationModule,
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '1d' },
    // }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
