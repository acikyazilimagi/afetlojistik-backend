import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './schemas/city.schema';
import { District, DistrictSchema } from './schemas/district.schema';
import { UserModule } from '../user/user.module';

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
    UserModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
