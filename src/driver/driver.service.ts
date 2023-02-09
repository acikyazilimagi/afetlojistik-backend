import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Driver } from './schemas/driver.schema';
import { Model } from 'mongoose';
import { LogMe } from '../common/decorators/log.decorator';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(Driver.name)
    private readonly driverModel: Model<Driver>
  ) {}

  @LogMe()
  async createDriver(
    createDriverDto: CreateDriverDto,
    organizationId: string
  ): Promise<Driver> {
    const driver = {
      ...createDriverDto,
      organizationId,
    };

    return this.driverModel.create(driver);
  }

  @LogMe()
  async updateDriver(
    driverPhone: string,
    updateDriverDto: UpdateDriverDto,
    organizationId: string
  ): Promise<Driver> {
    return this.driverModel.findOneAndUpdate(
      { phone: driverPhone },
      {
        ...updateDriverDto,
        organizationId,
      },
      { new: true }
    );
  }
}
