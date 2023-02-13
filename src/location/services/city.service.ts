import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { City, CityDocument } from '../schemas/city.schema';
import { LocationLogic } from '../logic/location.logic';
import { DisctrictDocument } from '../schemas/district.schema';
import { LogMe } from '../../common/decorators/log.decorator';
import { DistrictService } from './district.service';

@Injectable()
export class CityService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(City.name)
    private readonly cityModel: Model<City>,
    private readonly districtService: DistrictService
  ) {}

  @LogMe()
  async getAllCities(): Promise<CityDocument[]> {
    const cities: CityDocument[] = await this.cityModel.find({}).lean();

    return LocationLogic.sortCitiesAlphabetically(cities);
  }

  @LogMe()
  async getCityById(cityId: string): Promise<CityDocument> {
    return this.cityModel.findById(cityId);
  }

  @LogMe()
  async getCitiesByIds(cityIds: string[]): Promise<CityDocument[]> {
    const cities: CityDocument[] = await this.cityModel.find({
      _id: { $in: cityIds },
    });

    return LocationLogic.sortCitiesAlphabetically(cities);
  }

  @LogMe()
  async getDistrictsOfCity(cityId: string): Promise<DisctrictDocument[]> {
    return this.districtService.getDistrictsOfCity(cityId);
  }
}
