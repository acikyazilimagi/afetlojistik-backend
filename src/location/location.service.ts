import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument } from './schemas/city.schema';
import { DisctrictDocument, District } from './schemas/district.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(City.name)
    private readonly cityDocument: Model<CityDocument>,
    @InjectModel(District.name)
    private readonly districtDocument: Model<DisctrictDocument>
  ) {}

  async getAllCities(): Promise<CityDocument[]> {
    return this.cityDocument
      .find({})
      .lean()
      .exec() as unknown as CityDocument[];
  }

  async getAllDiscritcts(): Promise<DisctrictDocument[]> {
    return this.districtDocument
      .find()
      .lean()
      .exec() as unknown as DisctrictDocument[];
  }

  async getCityById(cityId: string): Promise<CityDocument> {
    return this.cityDocument.findById(cityId);
  }

  async getDistrictbyId(districtId: string): Promise<DisctrictDocument> {
    return this.districtDocument.findById(districtId);
  }
}
