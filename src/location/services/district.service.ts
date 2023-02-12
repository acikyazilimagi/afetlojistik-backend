import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { DisctrictDocument, District } from '../schemas/district.schema';
import { LocationLogic } from '../logic/location.logic';
import { LogMe } from '../../common/decorators/log.decorator';

@Injectable()
export class DistrictService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(District.name)
    private readonly districtModel: Model<District>
  ) {}

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
}
