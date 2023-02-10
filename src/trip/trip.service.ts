import { Injectable } from '@nestjs/common';
import { CreateTripDto, ProductDto } from './dto/create-trip.dto';
import { Trip, TripDocument } from './schemas/trip.schema';
import { LogMe } from '../common/decorators/log.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { TripsStatuses } from './types/trip.type';
import { TripInvalidLocationException, TripInvalidOrganizationExcetion, TripInvalidProductException, TripNotFoundException } from './exceptions/trip.exception';
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
  async create(
    createTripDto: CreateTripDto,
    userId: string,
    organizationId: string
  ): Promise<TripDocument> {
    const organization: OrganizationDocument = await this.organizationService.getOrganizationById(organizationId);

    if(!organization) {
      throw new TripInvalidOrganizationExcetion({ organizationId });
    }

    const { fromLocation, toLocation }: CreateTripDto = createTripDto;
    const [ fromCity, fromDistrict, toCity, toDistrict ]: DisctrictDocument[] = await Promise.all([
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

    const { products }: CreateTripDto = createTripDto;
    const distinctCategories: string[] = TripLogic.getDistinctCategoriesFromProducts(products);
    const categories: CategoryDocument[] = await this.categoryService.getCategoriesByIds(distinctCategories);
    const invalidProducts: ProductDto[] = TripLogic.getInvalidProductsByCategories(products, categories);
    if (invalidProducts && invalidProducts.length > 0) {
      throw new TripInvalidProductException({ invalidProducts });
    }

    const statusChangeLog: StatusChangeLog[] = [{
      status: TripsStatuses.CREATED,
      createdBy: userId,
    }];

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
