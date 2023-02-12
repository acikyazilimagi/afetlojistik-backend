import {
  Controller,
  Post,
  Body,
  UseGuards,
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
