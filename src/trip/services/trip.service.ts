import { Injectable } from '@nestjs/common';
import { CreateTripDto, ProductDto } from '../dto/create-trip.dto';
import { Trip, TripDocument } from '../schemas/trip.schema';
import { LogMe } from '../../common/decorators/log.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { TripsStatuses } from '../types/trip.type';
import {
  TripInvalidLocationException,
  TripInvalidOrganizationExcetion,
  TripInvalidProductException,
  TripNotFoundException,
} from '../exceptions/trip.exception';
import { LocationService } from '../../location/location.service';
import { CategoryService } from '../../category/category.service';
import TripFormatter from '../formatters/trip-populate.formatter';
import { UserService } from '../../user/user.service';
import { DisctrictDocument } from 'src/location/schemas/district.schema';
import { TripLogic } from '../logic/trip.logic';
import { CategoryDocument } from 'src/category/schemas/category.schema';
import { StatusChangeLog } from '../schemas/status.change.log.schema';
import { OrganizationService } from 'src/organization/organization.service';
import { OrganizationDocument } from 'src/organization/schemas/organization.schema';
import { FilterTripDto } from '../dto/filter-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { AWSSNSService } from 'src/notification/services/aws-sns.service';
import { DispatchService } from 'src/dispatch/dispatch.service';
import { IDispatchable } from 'src/dispatch/types/dispatch.types';
import { PopulatedTripResponseDto } from '../dto/response/common/populated-trip.response.dto';

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
    private readonly snsService: AWSSNSService,
    private readonly dispatchService: DispatchService,
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

    const populatedTrip: any = await this.getPopulatedTripById(createdTrip._id.toString(), createdTrip.organizationId);
    const dispatchData: IDispatchable = {
      OrderId: populatedTrip._id.toString(),
      OrderType: Trip.name,
      PlannedDate: populatedTrip.estimatedDepartTime.toISOString(),
      RequiredVehicleProperties: populatedTrip.vehicle.plate.truck,
      FromLocationCity: populatedTrip.fromLocation.cityName,
      FromLocationCounty: populatedTrip.fromLocation.districtName,
      FromLocationAddress: populatedTrip.fromLocation.address!,
      ToLocationCity: populatedTrip.toLocation.cityName,
      ToLocationCounty: populatedTrip.toLocation.districtName,
      ToLocationAddress: populatedTrip.toLocation.address!,
      Note: populatedTrip.notes,
    };

    await this.dispatchService.dispatch(dispatchData);

    const {
      vehicle: { phone },
    } = createTripDto;

    const messageBody = 'kvkk metni';

    if (phone) {
      await this.snsService.sendSMS('+90' + phone, messageBody);
    }

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

    const [populatedTrip]: any = await this.tripsPopulate([trip]);
    const dispatchData: IDispatchable = {
      OrderId: populatedTrip._id.toString(),
      OrderType: Trip.name,
      PlannedDate: populatedTrip.estimatedDepartTime.toISOString(),
      RequiredVehicleProperties: populatedTrip.vehicle.plate.truck,
      FromLocationCity: populatedTrip.fromLocation.cityName,
      FromLocationCounty: populatedTrip.fromLocation.districtName,
      FromLocationAddress: populatedTrip.fromLocation.address!,
      ToLocationCity: populatedTrip.toLocation.cityName,
      ToLocationCounty: populatedTrip.toLocation.districtName,
      ToLocationAddress: populatedTrip.toLocation.address!,
      Note: populatedTrip.notes,
    };

    await this.dispatchService.dispatch(dispatchData);
    
    return populatedTrip;
  }

  @LogMe()
  async getTripById(tripId: string, organizationId: string): Promise<TripDocument> {
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
        .sort({ createdAt: -1 })
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
    const trip = await this.getTripById(tripId, organizationId);

    await this.validateTrip(updateTripDto);

    const {
      vehicle: { phone: oldDriverPhoneNumber },
    } = trip;

    const {
      vehicle: { phone: newDriverPhoneNumber },
    } = updateTripDto;

    if (newDriverPhoneNumber !== oldDriverPhoneNumber) {
      const messageBody = 'kvkk metni';

      await this.snsService.sendSMS('+90' + newDriverPhoneNumber, messageBody);
    }

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

    if (filterTripDto.startDate || filterTripDto.endDate) {
      query.createdAt = {};

      filterTripDto.startDate
        ? (query.createdAt.$gte = filterTripDto.startDate)
        : undefined;

      filterTripDto.endDate
        ? (query.createdAt.$lte = filterTripDto.endDate)
        : undefined;
    }

    const result = {
      data: (await this.tripModel
        .find(query)
        .skip(skip || 0)
        .limit(limit || Number.MAX_SAFE_INTEGER)
        .lean()
        .sort({ createdAt: -1 })
        .exec()) as unknown as TripDocument[],
      total: (await this.tripModel.countDocuments(query)) as unknown as number,
    };

    return {
      data: await this.tripsPopulate(result.data),
      total: result.total,
    };
  }
}
