import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActiveUserAuthGuard } from 'src/auth/active-user.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { CreateTripDto } from '../dto/create-trip.dto';
import { FilterTripDto } from '../dto/filter-trip.dto';
import {
  CreateTripResponseDto,
  FilterTripsResponseDto,
  GetAllTripsResponseDto,
  GetPopulatedTripByTripIdResponseDto,
  GetTripByTripNumberResponseDto,
} from '../dto/response';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { TripDocument } from '../schemas/trip.schema';
import { TripService } from '../services/trip.service';

@UseInterceptors(TransformResponseInterceptor)
@ApiTags('Trip')
@Controller('trip')
@UseGuards(JwtAuthGuard, ActiveUserAuthGuard)
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiOperation({ summary: 'Create trip.' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateTripResponseDto })
  create(
    @Req() req,
    @Body() createTripDto: CreateTripDto
  ): Promise<TripDocument> {
    const { id: userId, organizationId } = req.user;
    return this.tripService.create(createTripDto, userId, organizationId);
  }

  @Get('/number/:tripNumber')
  @ApiOperation({ summary: 'Get trip by trip number.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetTripByTripNumberResponseDto })
  getTripByNumber(
    @Req() req,
    @Param('tripNumber') tripNumber: string
  ): Promise<TripDocument> {
    const { organizationId } = req.user;
    return this.tripService.getTripByNumber(tripNumber, organizationId);
  }

  @Get(':tripId')
  @ApiOperation({ summary: 'Get populated trip by trip id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPopulatedTripByTripIdResponseDto,
  })
  getTripById(
    @Req() req,
    @Param('tripId') tripId: string
  ): Promise<TripDocument> {
    const { organizationId } = req.user;
    return this.tripService.getPopulatedTripById(tripId, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllTripsResponseDto })
  getAllTrips(
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
    @Req() req,
    @Body() filterTripDto: FilterTripDto,
    @Query() { limit, skip }: PaginationDto
  ): Promise<{ data: TripDocument[]; total: number }> {
    const { organizationId } = req.user;
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
    @Req() req,
    @Param('tripId') tripId: string,
    @Body() updateTripDto: UpdateTripDto
  ): Promise<TripDocument> {
    const { organizationId, id: userId } = req.user;
    return this.tripService.updateTrip(
      tripId,
      updateTripDto,
      userId,
      organizationId
    );
  }
}
