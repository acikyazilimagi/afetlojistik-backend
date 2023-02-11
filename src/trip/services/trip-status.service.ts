import { Injectable } from '@nestjs/common';
import { Trip, TripDocument } from '../schemas/trip.schema';
import { LogMe } from '../../common/decorators/log.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { TripsStatuses } from '../types/trip.type';
import { StatusChangeLog } from '../schemas/status.change.log.schema';
import { TripService } from './trip.service';
import {
  TripDriverNameNotDefinedException,
  TripStatusNotAllowedException,
  TripDriverPhoneNotDefinedException,
  TripVehiclePlateNotDefinedException,
} from '../exceptions/trip.exception';
import { UpdateStatusArrivedDto } from '../dto/update-status-arrived.dto';
import { AWSSNSService } from 'src/notification/services/aws-sns.service';

@Injectable()
export class TripStatusService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Trip.name)
    private readonly tripModel: Model<Trip>,
    private readonly tripService: TripService,
    private readonly snsService: AWSSNSService
  ) {}

  @LogMe()
  async updateTripStatusOnway(
    tripId: string,
    userId: string,
    organizationId: string
  ): Promise<TripDocument> {
    const trip = await this.tripService.getTripById(tripId, organizationId);

    const status = TripsStatuses.ONWAY;

    const allowedStatuses = [TripsStatuses.CREATED];

    if (!allowedStatuses.includes(trip.status)) {
      throw new TripStatusNotAllowedException();
    }

    if (!trip.vehicle.name) {
      throw new TripDriverNameNotDefinedException();
    }

    if (!trip.vehicle.phone) {
      throw new TripDriverPhoneNotDefinedException();
    }

    if (!trip.vehicle.plate) {
      throw new TripVehiclePlateNotDefinedException();
    }

    const statusChangeLog: StatusChangeLog = {
      status,
      createdBy: userId,
      createdAt: new Date(),
    };

    return (await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      {
        $set: {
          status,
        },
        $addToSet: { statusChangeLog },
      },
      { new: true }
    )) as unknown as TripDocument;
  }

  @LogMe()
  async updateTripStatusArrived(
    tripId: string,
    userId: string,
    organizationId: string,
    updateStatusArrivedDto: UpdateStatusArrivedDto
  ): Promise<TripDocument> {
    const trip = await this.tripService.getTripById(tripId, organizationId);

    const status = TripsStatuses.ARRIVED;

    const allowedStatuses = [TripsStatuses.ONWAY];

    if (!allowedStatuses.includes(trip.status)) {
      throw new TripStatusNotAllowedException();
    }

    const statusChangeLog: StatusChangeLog = {
      status,
      createdBy: userId,
      createdAt: new Date(updateStatusArrivedDto.arrivedTime),
    };

    return (await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      {
        $set: { status },
        $addToSet: { statusChangeLog },
      },
      { new: true }
    )) as unknown as TripDocument;
  }

  @LogMe()
  async updateTripStatusCancelled(
    tripId: string,
    userId: string,
    organizationId: string
  ): Promise<TripDocument> {
    const trip = await this.tripService.getTripById(tripId, organizationId);

    const status = TripsStatuses.CANCELLED;

    const allowedStatuses = [
      TripsStatuses.CREATED,
      TripsStatuses.ONWAY,
      TripsStatuses.ARRIVED,
    ];

    if (!allowedStatuses.includes(trip.status)) {
      throw new TripStatusNotAllowedException();
    }

    const statusChangeLog: StatusChangeLog = {
      status,
      createdBy: userId,
      createdAt: new Date(),
    };

    return (await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      {
        $set: { status },
        $addToSet: { statusChangeLog },
      }
    )) as unknown as TripDocument;
  }
}
