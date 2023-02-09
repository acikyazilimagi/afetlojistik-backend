import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';

@Module({
  controllers: [TripController],
  providers: [TripService]
})
export class TripModule {}
