import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Get,
  Param,
  Query,
  Put,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { TripService } from '../services/trip.service';
import { CreateTripDto } from '../dto/create-trip.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../../user/guards/user.guard';
import { TokenHeader } from '../../common/headers/token.header';
import { User } from '../../user/decorators/user.decorator';
import { UserDocument } from '../../user/schemas/user.schema';
import { TripDocument } from '../schemas/trip.schema';
import { FilterTripDto } from '../dto/filter-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  CreateTripResponseDto,
  FilterTripsResponseDto,
  GetAllTripsResponseDto,
  GetPopulatedTripByTripIdResponseDto,
  GetTripByTripNumberResponseDto,
} from '../dto/response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Trip')
@Controller('trip')
@UseGuards(JwtAuthGuard)
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiOperation({ summary: 'Create trip.' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateTripResponseDto })
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
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPopulatedTripByTripIdResponseDto,
  })
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
  getAllTrips(
    @Headers() tokenHeader: TokenHeader,
    @Req() req,
    @Query() { limit, skip }: PaginationDto
  ): Promise<{ data: TripDocument[]; total: number }> {
    const { organizationId } = req.user;
    return this.tripService.getAllTrips(organizationId, limit, skip);
  }

  @Post('filter')
  @ApiOperation({ summary: 'Filter trips.' })
  @ApiResponse({ status: HttpStatus.OK, type: FilterTripsResponseDto })
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
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripDto })
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
}
