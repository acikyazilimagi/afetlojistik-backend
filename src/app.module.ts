import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { MongoDbModule } from './bootstrap-modules';
import { CategoryModule } from './category/category.module';
import { ValidationPipeConfig } from './common/config/validation-pipe.config';
import { LogModule } from './common/logger';
import configuration from './config/configuration';
import { CoreModule } from './core/core.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { HealthModule } from './health/health.module';
import { IntegrationModule } from './integration/integration.module';
import { LocationModule } from './location/location.module';
import { NotificationModule } from './notification/notification.module';
import { OrganizationModule } from './organization/organization.module';
import { TripModule } from './trip/trip.module';
import { UserModule } from './user/user.module';

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
    IntegrationModule,
    DispatchModule,
    TripModule,
    CategoryModule,
    NotificationModule,
    CoreModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe(ValidationPipeConfig),
    },
  ],
})
export class AppModule {}
