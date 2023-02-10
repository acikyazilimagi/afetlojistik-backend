import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip } from './schemas/trip.schema';
import { LogMe } from '../common/decorators/log.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { TripsStatuses } from './types/trip.type';

@Injectable()
export class TripService {
  constructor(
    @InjectModel(Trip.name)
    private readonly tripModel: Model<Trip>,
    private readonly logger: PinoLogger
  ) {}
  @LogMe()
  async create(
    createTripDto: CreateTripDto,
    userId: string,
    organizationId: string
  ): Promise<Trip> {
    const statusChangeLog = {
      status: TripsStatuses.CREATED,
      createdBy: userId,
    };

    return new this.tripModel({
      ...createTripDto,
      organizationId,
      createdBy: userId,
      statusChangeLog: statusChangeLog,
    }).save();
  }
  @LogMe()
  async getTripByNumber(
    tripNumber: string,
    organizationId: string
  ): Promise<Trip> {
    const trip = await this.tripModel.findOne({
      tripNumber: +tripNumber,
      organizationId,
    });

    if (!trip) throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);

    return trip;
  }

  @LogMe()
  async getAllTrips(organizationId: string): Promise<Trip[]> {
    return this.tripModel.find({
      organizationId,
    });
  }
}
