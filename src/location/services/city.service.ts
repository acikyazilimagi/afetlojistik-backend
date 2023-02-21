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
  async getAllCities(): Promise<{ cities: CityDocument[] }> {
    const cities = await this.cityModel.find({});

    const sortedCities = LocationLogic.sortCitiesAlphabetically(cities);

    return { cities: sortedCities };
  }

  @LogMe()
  async getCityById(cityId: string): Promise<{ city: CityDocument }> {
    const city = await this.cityModel.findById(cityId);

    // TODO: Check is null, if true throw exception

    return { city };
  }

  @LogMe()
  async getCitiesByIds(cityIds: string[]): Promise<{ cities: CityDocument[] }> {
    const cities = await this.cityModel.find({
      _id: { $in: cityIds },
    });

    const sortedCities = LocationLogic.sortCitiesAlphabetically(cities);

    return { cities: sortedCities };
  }

  @LogMe()
  async getDistrictsOfCity(
    cityId: string
  ): Promise<{ districts: DistrictDocument[] }> {
    const districts = await this.districtService.getDistrictsOfCity(cityId);

    return { districts };
  }
}
