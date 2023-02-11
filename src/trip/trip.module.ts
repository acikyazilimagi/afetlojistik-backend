import { Module } from '@nestjs/common';
import { TripService } from './services/trip.service';
import { TripController } from './controllers/trip.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schemas/trip.schema';
import { LocationModule } from '../location/location.module';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Connection } from 'mongoose';
import { CategoryModule } from '../category/category.module';
import TripFormatter from './formatters/trip-populate.formatter';
import { OrganizationModule } from 'src/organization/organization.module';
import { NotificationModule } from '../notification/notification.module';
import { TripStatusController } from './controllers/trip-status.controller';
import { TripStatusService } from './services/trip-status.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Trip.name,
        useFactory: (connection: Connection) => {
          const schema = TripSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            inc_field: 'tripNumber',
            start_seq: 1,
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    LocationModule,
    CategoryModule,
    NotificationModule,
    OrganizationModule,
  ],
  controllers: [TripController, TripStatusController],
  providers: [TripService, TripStatusService, TripFormatter],
})
export class TripModule {}
