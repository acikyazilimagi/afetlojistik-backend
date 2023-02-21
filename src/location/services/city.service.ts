import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from '../../common/decorators/log.decorator';
import { LocationLogic } from '../logic/location.logic';
import { City, CityDocument } from '../schemas/city.schema';
import { DistrictDocument } from '../schemas/district.schema';
import { DistrictService } from './district.service';

@Injectable()
export class CityService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(City.name)
    private readonly cityModel: Model<CityDocument>,
    private readonly districtService: DistrictService
  ) {}

  @LogMe()
  async getAllCities(): Promise<CityDocument[]> {
    const cities = await this.cityModel.find({});

    return LocationLogic.sortCitiesAlphabetically(cities);
  }

  @LogMe()
  async getCityById(cityId: string): Promise<CityDocument> {
    return this.cityModel.findById(cityId);
  }

  @LogMe()
  async getCitiesByIds(cityIds: string[]): Promise<CityDocument[]> {
    const cities = await this.cityModel.find({
      _id: { $in: cityIds },
    });

    return LocationLogic.sortCitiesAlphabetically(cities);
  }

  @LogMe()
  async getDistrictsOfCity(cityId: string): Promise<DistrictDocument[]> {
    return this.districtService.getDistrictsOfCity(cityId);
  }
}
