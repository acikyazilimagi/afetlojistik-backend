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
import { AWSSNSService } from 'src/notification/services/aws-sns.service';

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
    private readonly userService: UserService,
    private readonly snsService: AWSSNSService
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

    const createdTrip = (await new this.tripModel({
      ...createTripDto,
      organizationId,
      createdBy: userId,
      statusChangeLog: statusChangeLog,
    }).save()) as unknown as TripDocument;

    const {
      vehicle: { phone },
    } = createTripDto;

    const messageBody = 'kvkk metni';

    await this.snsService.sendSMS('+90' + phone, messageBody);

    return createdTrip;
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
  async getAllTrips(
    organizationId: string,
    limit: number,
    skip: number
  ): Promise<{ data: TripDocument[]; total: number }> {
    const query = { organizationId };
    const result = {
      data: (await this.tripModel
        .find(query)
        .skip(skip || 0)
        .limit(limit || Number.MAX_SAFE_INTEGER)
        .lean()
        .exec()) as unknown as TripDocument[],
      total: (await this.tripModel.countDocuments(query)) as unknown as number,
    };

    return {
      data: await this.tripsPopulate(result.data),
      total: result.total,
    };
  }

  @LogMe()
  async updateTrip(
    tripId: string,
    updateTripDto: UpdateTripDto,
    userId: string,
    organizationId: string
  ): Promise<TripDocument> {
    await this.getTripById(tripId, organizationId);

    await this.validateTrip(updateTripDto);

    return (await this.tripModel.findOneAndUpdate(
      {
        _id: tripId,
      },
      {
        $set: {
          ...updateTripDto,
        },
      },
      { new: true }
    )) as unknown as TripDocument;
  }

  @LogMe()
  async updateTripStatus(
    tripId: string,
    status: TripsStatuses,
    userId: string,
    organizationId: string
  ): Promise<TripDocument> {
    await this.getTripById(tripId, organizationId);

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
      },
      { new: true }
    )) as unknown as TripDocument;
  }

  @LogMe()
  async filterTrips(
    filterTripDto: FilterTripDto,
    organizationId: string,
    limit: number,
    skip: number
  ): Promise<{ data: TripDocument[]; total: number }> {
    const query: any = {
      organizationId,
    };

    if (filterTripDto.createdBy) {
      query.createdBy = filterTripDto.createdBy;
    }

    if (filterTripDto.truckPlateNumber) {
      query['vehicle.plate.truck'] = filterTripDto.truckPlateNumber;
    }

    if (filterTripDto.trailerPlateNumber) {
      query['vehicle.plate.trailer'] = filterTripDto.trailerPlateNumber;
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

    const result = {
      data: (await this.tripModel
        .find(query)
        .skip(skip || 0)
        .limit(limit || Number.MAX_SAFE_INTEGER)
        .lean()
        .exec()) as unknown as TripDocument[],
      total: (await this.tripModel.countDocuments(query)) as unknown as number,
    };

    return {
      data: await this.tripsPopulate(result.data),
      total: result.total,
    };
  }
}
