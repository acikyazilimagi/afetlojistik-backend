import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip, TripDocument } from './schemas/trip.schema';
import { LogMe } from '../common/decorators/log.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { TripsStatuses } from './types/trip.type';
import TripNotFoundException from './exceptions/trip-not-found.exception';
import { LocationService } from '../location/location.service';
import { CategoryService } from '../category/category.service';
import TripFormatter from './formatters/trip-populate.formatter';
import { UserService } from '../user/user.service';

@Injectable()
export class TripService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Trip.name)
    private readonly tripModel: Model<Trip>,
    private readonly locationService: LocationService,
    private readonly categoryService: CategoryService,
    private readonly tripFormatter: TripFormatter,
    private readonly userService: UserService
  ) {}
  @LogMe()
  async create(
    createTripDto: CreateTripDto,
    userId: string,
    organizationId: string
  ): Promise<TripDocument> {
    const statusChangeLog = {
      status: TripsStatuses.CREATED,
      createdBy: userId,
    };

    return (await new this.tripModel({
      ...createTripDto,
      organizationId,
      createdBy: userId,
      statusChangeLog: statusChangeLog,
    }).save()) as unknown as TripDocument;
  }
  @LogMe()
  async getTripByNumber(
    tripNumber: string,
    organizationId: string
  ): Promise<TripDocument> {
    const trip: TripDocument = await this.tripModel.findOne({
      tripNumber: +tripNumber,
      organizationId,
    });

    if (!trip) throw new TripNotFoundException();

    return trip;
  }

  @LogMe()
  async getAllTrips(organizationId: string): Promise<TripDocument[]> {
    const trips: TripDocument[] = await this.tripModel
      .find({
        organizationId,
      })
      .lean();

    const result = this.tripFormatter.getPopulateIds(trips);

    const [cities, districts, categories, users] = await Promise.all([
      this.locationService.getCitiesByIds(result.cityIds),
      this.locationService.getDistrictsByIds(result.districtIds),
      this.categoryService.getCategoriesByIds(result.categoryIds),
      this.userService.getUsersByIds(result.userIds),
    ]);

    return trips.map((trip) =>
      this.tripFormatter.populateTrip(
        trip,
        cities,
        districts,
        categories,
        users
      )
    );
  }
}
