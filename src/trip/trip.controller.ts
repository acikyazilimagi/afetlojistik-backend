import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Get,
  Param,
  Patch,
  Query,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../user/guards/user.guard';
import { TokenHeader } from '../common/headers/token.header';
import { User } from '../user/decorators/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { TripDocument } from './schemas/trip.schema';
import { FilterTripDto } from './dto/filter-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  CreateTripResponseDto,
  FilterTripsResponseDto,
  GetAllTripsResponseDto,
  GetTripByTripIdResponseDto,
  GetTripByTripNumberResponseDto,
  UpdateTripResponseDto,
  UpdateTripStatusResponseDto,
} from './dto/response';

@ApiTags('Trip')
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiOperation({ summary: 'Create trip.' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateTripResponseDto })
  @UseGuards(UserAuthGuard)
  create(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Body() createTripDto: CreateTripDto
  ): Promise<TripDocument> {
    const { _id: userId, organizationId } = user;
    return this.tripService.create(createTripDto, userId, organizationId);
  }

  @Get('/number/:tripNumber')
  @ApiOperation({ summary: 'Get trip by trip number.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetTripByTripNumberResponseDto })
  @UseGuards(UserAuthGuard)
  getTripByNumber(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripNumber') tripNumber: string
  ): Promise<TripDocument> {
    const { organizationId } = user;
    return this.tripService.getTripByNumber(tripNumber, organizationId);
  }

  @Get(':tripId')
  @ApiOperation({ summary: 'Get populated trip by trip id.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetTripByTripIdResponseDto })
  @UseGuards(UserAuthGuard)
  getTripById(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string
  ): Promise<TripDocument> {
    const { organizationId } = user;
    return this.tripService.getPopulatedTripById(tripId, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllTripsResponseDto })
  @UseGuards(UserAuthGuard)
  getAllTrips(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Query() { limit, skip }: PaginationDto
  ): Promise<{ data: TripDocument[]; total: number }> {
    const { organizationId } = user;
    return this.tripService.getAllTrips(organizationId, limit, skip);
  }

  @Post('filter')
  @ApiOperation({ summary: 'Filter trips.' })
  @ApiResponse({ status: HttpStatus.OK, type: FilterTripsResponseDto })
  @UseGuards(UserAuthGuard)
  filterTrips(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Body() filterTripDto: FilterTripDto,
    @Query() { limit, skip }: PaginationDto
  ): Promise<{ data: TripDocument[]; total: number }> {
    const { organizationId } = user;
    return this.tripService.filterTrips(
      filterTripDto,
      organizationId,
      limit,
      skip
    );
  }

  @Put(':tripId')
  @ApiOperation({ summary: 'Update trip.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripResponseDto })
  @UseGuards(UserAuthGuard)
  updateTrip(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string,
    @Body() updateTripDto: UpdateTripDto
  ): Promise<TripDocument> {
    const { organizationId, _id: userId } = user;
    return this.tripService.updateTrip(
      tripId,
      updateTripDto,
      userId,
      organizationId
    );
  }

  @Patch(':tripId/status')
  @ApiOperation({ summary: 'Update trip status.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripStatusResponseDto })
  @UseGuards(UserAuthGuard)
  updateTripStatus(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string,
    @Body() { status }: UpdateStatusDto
  ): Promise<TripDocument> {
    const { organizationId, _id: userId } = user;
    return this.tripService.updateTripStatus(
      tripId,
      status,
      userId,
      organizationId
    );
  }
}
