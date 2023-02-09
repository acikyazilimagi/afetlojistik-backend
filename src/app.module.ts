import { Module, ValidationPipe } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipeConfig } from './common/config/validation-pipe.config';
import { LocationModule } from './location/location.module';
import { TransformInterceptor } from './common/interceptors';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'debug',
        autoLogging: false,
        formatters: {
          level(label: string) {
            return { level: label };
          },
        },
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    HealthModule,
    UserModule,
    LocationModule,
    OrganizationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe(ValidationPipeConfig),
    },
  ],
})
export class AppModule {}
