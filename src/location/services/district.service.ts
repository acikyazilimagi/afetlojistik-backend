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
  async getAllDistricts(): Promise<{ districts: DistrictDocument[] }> {
    const districts = await this.districtModel.find({});

    const sortedDistricts =
      LocationLogic.sortDistrictsAlphabetically(districts);

    return { districts: sortedDistricts };
  }

  @LogMe()
  async getDistrictsOfCity(
    cityId: string
  ): Promise<{ districts: DistrictDocument[] }> {
    const districts = await this.districtModel.find({ cityId });

    return { districts };
  }

  @LogMe()
  async getDistrictbyId(
    districtId: string
  ): Promise<{ district: DistrictDocument }> {
    const district = await this.districtModel.findById(districtId);

    return { district };
  }

  @LogMe()
  async getDistrictsByIds(
    districtIds: string[]
  ): Promise<{ districts: DistrictDocument[] }> {
    const districts = await this.districtModel.find({
      _id: { $in: districtIds },
    });

    const sortedDistricts =
      LocationLogic.sortDistrictsAlphabetically(districts);

    return { districts: sortedDistricts };
  }
}
