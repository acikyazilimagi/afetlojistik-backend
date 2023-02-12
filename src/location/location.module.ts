import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './schemas/city.schema';
import { District, DistrictSchema } from './schemas/district.schema';
import { CityController } from './controllers/city.controller';
import { DistrictController } from './controllers/districts.controller';
import { CityService } from './services/city.service';
import { DistrictService } from './services/district.service';

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
  controllers: [CityController, DistrictController],
  providers: [CityService, DistrictService],
  exports: [CityService, DistrictService],
})
export class LocationModule {}
