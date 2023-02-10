import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schemas/trip.schema';
import { LocationModule } from '../location/location.module';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Connection } from 'mongoose';

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
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
