import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from '../../common/decorators/log.decorator';
import { LocationLogic } from '../logic/location.logic';
import { District, DistrictDocument } from '../schemas/district.schema';

@Injectable()
export class DistrictService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(District.name)
    private readonly districtModel: Model<DistrictDocument>
  ) {}

  @LogMe()
  async getAllDistricts(): Promise<DistrictDocument[]> {
    const districts = await this.districtModel.find({});

    return LocationLogic.sortDistrictsAlphabetically(districts);
  }

  @LogMe()
  async getDistrictsOfCity(cityId: string): Promise<DistrictDocument[]> {
    return this.districtModel.find({ cityId });
  }

  @LogMe()
  async getDistrictbyId(districtId: string): Promise<DistrictDocument> {
    return this.districtModel.findById(districtId);
  }

  @LogMe()
  async getDistrictsByIds(districtIds: string[]): Promise<DistrictDocument[]> {
    const districts = await this.districtModel.find({
      _id: { $in: districtIds },
    });

    return LocationLogic.sortDistrictsAlphabetically(districts);
  }
}
