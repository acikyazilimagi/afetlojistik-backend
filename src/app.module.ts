import { Module, ValidationPipe } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipeConfig } from './common/config/validation-pipe.config';
import { LocationModule } from './location/location.module';
import { TransformInterceptor } from './common/interceptors';
import { OrganizationModule } from './organization/organization.module';
import { TripModule } from './trip/trip.module';
import { MongoDbModule } from './bootstrap-modules';
import { LogModule } from './common/logger';


@Module({
  imports: [
    LogModule,
    MongoDbModule,
    HealthModule,
    UserModule,
    LocationModule,
    OrganizationModule,
    TripModule,
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
