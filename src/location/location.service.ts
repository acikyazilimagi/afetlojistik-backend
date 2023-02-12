import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { City, CityDocument } from './schemas/city.schema';
import { DisctrictDocument, District } from './schemas/district.schema';
import { LogMe } from '../common/decorators/log.decorator';
import { PinoLogger } from 'nestjs-pino';
import { LocationLogic } from './logic/location.logic';

@Injectable()
export class LocationService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(City.name)
    private readonly cityModel: Model<City>,
    @InjectModel(District.name)
    private readonly districtModel: Model<District>
  ) {}

  @LogMe()
  async getAllCities(): Promise<CityDocument[]> {
    const cities: CityDocument[] = await this.cityModel.find({}).lean();

    return LocationLogic.sortCitiesAlphabetically(cities);
  }

  @LogMe()
  async getAllDistricts(): Promise<DisctrictDocument[]> {
    const districts: DisctrictDocument[] = await this.districtModel.find({});

    return LocationLogic.sortDistrictsAlphabetically(districts);
  }

  @LogMe()
  async getDistrictsOfCity(cityId: string): Promise<DisctrictDocument[]> {
    return this.districtModel.find({ cityId: new Types.ObjectId(cityId) });
  }

  @LogMe()
  async getCityById(cityId: string): Promise<DisctrictDocument> {
    return this.cityModel.findById(cityId);
  }

  @LogMe()
  async getDistrictbyId(districtId: string): Promise<DisctrictDocument> {
    return this.districtModel.findById(districtId);
  }

  @LogMe()
  async getDistrictsByIds(districtIds: string[]): Promise<DisctrictDocument[]> {
    const districts: DisctrictDocument[] = await this.districtModel.find({
      _id: { $in: districtIds },
    });

    return LocationLogic.sortDistrictsAlphabetically(districts);
  }

  @LogMe()
  async getCitiesByIds(cityIds: string[]): Promise<CityDocument[]> {
    const cities: CityDocument[] = await this.cityModel.find({
      _id: { $in: cityIds },
    });

    return LocationLogic.sortCitiesAlphabetically(cities);
  }
}
