import { Module, ValidationPipe } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipeConfig } from './common/config/validation-pipe.config';
import { LocationModule } from './location/location.module';
import { TransformInterceptor } from './common/interceptors';
import { OrganizationModule } from './organization/organization.module';
import { TripModule } from './trip/trip.module';
import { CategoryModule } from './category/category.module';
import { LogModule } from './common/logger';
import { MongoDbModule } from './bootstrap-modules';
import { NotificationModule } from './notification/notification.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    LogModule,
    MongoDbModule,
    HealthModule,
    UserModule,
    LocationModule,
    OrganizationModule,
    TripModule,
    CategoryModule,
    NotificationModule,
    CoreModule,
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
