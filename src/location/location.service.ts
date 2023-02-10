import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { City, CityDocument } from './schemas/city.schema';
import { DisctrictDocument, District } from './schemas/district.schema';
import { LogMe } from '../common/decorators/log.decorator';
import { PinoLogger } from 'nestjs-pino';

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
    return this.cityModel.find({});
  }

  @LogMe()
  async getAllDistricts(): Promise<DisctrictDocument[]> {
    return this.districtModel.find();
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
}
