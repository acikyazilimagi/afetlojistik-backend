import { Injectable } from '@nestjs/common';
import { CreateTripDto, ProductDto } from './dto/create-trip.dto';
import { Trip, TripDocument } from './schemas/trip.schema';
import { LogMe } from '../common/decorators/log.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { TripsStatuses } from './types/trip.type';
import {
  TripInvalidLocationException,
  TripInvalidOrganizationExcetion,
  TripInvalidProductException,
  TripNotFoundException,
} from './exceptions/trip.exception';
import { LocationService } from '../location/location.service';
import { CategoryService } from '../category/category.service';
import TripFormatter from './formatters/trip-populate.formatter';
import { UserService } from '../user/user.service';
import { DisctrictDocument } from 'src/location/schemas/district.schema';
import { TripLogic } from './logic/trip.logic';
import { CategoryDocument } from 'src/category/schemas/category.schema';
import { StatusChangeLog } from './schemas/status.change.log.schema';
import { OrganizationService } from 'src/organization/organization.service';
import { OrganizationDocument } from 'src/organization/schemas/organization.schema';
import { FilterTripDto } from './dto/filter-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Trip.name)
    private readonly tripModel: Model<Trip>,
    private readonly locationService: LocationService,
    private readonly categoryService: CategoryService,
    private readonly organizationService: OrganizationService,
    private readonly tripFormatter: TripFormatter,
    private readonly userService: UserService
  ) {}

  @LogMe()
  async validateTrip(trip) {
    const { fromLocation, toLocation } = trip;
    const [fromCity, fromDistrict, toCity, toDistrict]: DisctrictDocument[] =
      await Promise.all([
        this.locationService.getCityById(fromLocation.cityId),
        this.locationService.getDistrictbyId(fromLocation.districtId),
        this.locationService.getCityById(toLocation.cityId),
        this.locationService.getDistrictbyId(toLocation.districtId),
      ]);

    if (!fromCity || !fromDistrict) {
      throw new TripInvalidLocationException({ fromLocation });
    }

    if (!toCity || !toDistrict) {
      throw new TripInvalidLocationException({ toLocation });
    }

    const { products } = trip;
    const distinctCategories: string[] =
      TripLogic.getDistinctCategoriesFromProducts(products);
    const categories: CategoryDocument[] =
      await this.categoryService.getCategoriesByIds(distinctCategories);
    const invalidProducts: ProductDto[] =
      TripLogic.getInvalidProductsByCategories(products, categories);
    if (invalidProducts && invalidProducts.length > 0) {
      throw new TripInvalidProductException({ invalidProducts });
    }
  }

  @LogMe()
  async create(
    createTripDto: CreateTripDto,
    userId: string,
    organizationId: string
  ): Promise<TripDocument> {
    const organization: OrganizationDocument =
      await this.organizationService.getOrganizationById(organizationId);

    if (!organization) {
      throw new TripInvalidOrganizationExcetion({ organizationId });
    }

    await this.validateTrip(createTripDto);

    const statusChangeLog: StatusChangeLog[] = [
      {
        status: TripsStatuses.CREATED,
        createdBy: userId,
        createdAt: new Date(),
      },
    ];

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
  async getPopulatedTripById(
    tripId: string,
    organizationId
  ): Promise<TripDocument> {
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
  async getTripById(tripId: string, organizationId): Promise<TripDocument> {
    const trip: TripDocument = await this.tripModel
      .findOne({
        _id: tripId,
        organizationId,
      })
      .lean();

    if (!trip) throw new TripNotFoundException();

    return trip;
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
  async updateTrip(
    tripId: string,
    updateTripDto: UpdateTripDto,
    userId: string,
    organizationId: string
  ): Promise<TripDocument> {
    const trip: TripDocument = await this.getTripById(tripId, organizationId);

    const tripWithStatusChangeLog: UpdateTripDto & {
      statusChangeLog?: StatusChangeLog[];
    } = updateTripDto;

    if (trip.status !== updateTripDto.status) {
      const statusChangeLog: StatusChangeLog = {
        status: updateTripDto.status,
        createdBy: userId,
        createdAt: new Date(),
      };

      tripWithStatusChangeLog.statusChangeLog = [
        ...trip.statusChangeLog,
        statusChangeLog,
      ];
    }

    await this.validateTrip(updateTripDto);

    return (await this.tripModel.findOneAndUpdate(
      {
        _id: tripId,
      },
      {
        $set: {
          ...tripWithStatusChangeLog,
        },
      },
      { new: true }
    )) as unknown as TripDocument;
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
