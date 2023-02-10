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
import { FilterTripDto } from './dto/filter-trip.dto';

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
  async getTripById(tripId: string, organizationId): Promise<TripDocument> {
    const trip: TripDocument = await this.tripModel
      .findOne({
        _id: tripId,
        organizationId,
      })
      .lean();

    if (!trip) throw new TripNotFoundException();

    const [populatedTrip] = await this.tripsPopulate([trip]);

    return populatedTrip;
  }

  @LogMe()
  async tripsPopulate(trips: TripDocument[]): Promise<TripDocument[]> {
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

  @LogMe()
  async getAllTrips(organizationId: string): Promise<TripDocument[]> {
    const trips: TripDocument[] = await this.tripModel
      .find({
        organizationId,
      })
      .lean();

    return this.tripsPopulate(trips);
  }

  @LogMe()
  async filterTrips(
    filterTripDto: FilterTripDto,
    organizationId: string
  ): Promise<TripDocument[]> {
    const query: any = {
      organizationId,
    };

    if (filterTripDto.createdBy) {
      query.createdBy = filterTripDto.createdBy;
    }

    if (filterTripDto.plateNumber) {
      query['vehicle.plateNumber'] = filterTripDto.plateNumber;
    }

    if (filterTripDto.driverName) {
      query['vehicle.name'] = {
        $regex: filterTripDto.driverName,
        $options: 'i',
      };
    }

    if (filterTripDto.driverPhone) {
      query['vehicle.phone'] = filterTripDto.driverPhone;
    }

    if (filterTripDto.fromCityId) {
      query['fromLocation.cityId'] = filterTripDto.fromCityId;
    }

    if (filterTripDto.fromDistrictId) {
      query['fromLocation.districtId'] = filterTripDto.fromDistrictId;
    }

    if (filterTripDto.toCityId) {
      query['toLocation.cityId'] = filterTripDto.toCityId;
    }

    if (filterTripDto.toDistrictId) {
      query['toLocation.districtId'] = filterTripDto.toDistrictId;
    }

    if (
      filterTripDto.productCategoryIds &&
      Array.isArray(filterTripDto.productCategoryIds) &&
      filterTripDto.productCategoryIds.length
    ) {
      query['products.categoryId'] = { $in: filterTripDto.productCategoryIds };
    }

    if (
      filterTripDto.statuses &&
      Array.isArray(filterTripDto.statuses) &&
      filterTripDto.statuses.length
    ) {
      query.status = { $in: filterTripDto.statuses };
    }

    const result = (await this.tripModel.find(query).lean()) as TripDocument[];

    return this.tripsPopulate(result);
  }
}
