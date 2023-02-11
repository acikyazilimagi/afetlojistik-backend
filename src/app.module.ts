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
import { IntegrationModule } from './integration/integration.module';
import { DispatchModule } from './dispatch/dispatch.module';

@Module({
  imports: [
    LogModule,
    MongoDbModule,
    HealthModule,
    UserModule,
    LocationModule,
    OrganizationModule,
    IntegrationModule,
    DispatchModule,
    TripModule,
    CategoryModule,
    NotificationModule,
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
