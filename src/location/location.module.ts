import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { City, CitySchema } from './schemas/city.schema';
import { District, DistrictSchema } from './schemas/district.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: City.name,
        schema: CitySchema,
      },
      {
        name: District.name,
        schema: DistrictSchema,
      },
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule { }
