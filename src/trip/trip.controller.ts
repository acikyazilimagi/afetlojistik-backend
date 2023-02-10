import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Get,
  Param,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../user/guards/user.guard';
import { TokenHeader } from '../common/headers/token.header';
import { User } from '../user/decorators/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { TripDocument } from './schemas/trip.schema';

@ApiTags('Trip')
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  create(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Body() createTripDto: CreateTripDto
  ): Promise<TripDocument> {
    const { _id: userId, organizationId } = user;
    return this.tripService.create(createTripDto, userId, organizationId);
  }

  @Get(':tripNumber')
  @UseGuards(UserAuthGuard)
  getTripByNumber(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripNumber') tripNumber: string
  ): Promise<TripDocument> {
    const { organizationId } = user;
    return this.tripService.getTripByNumber(tripNumber, organizationId);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  getAllTrips(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument
  ): Promise<TripDocument[]> {
    const { organizationId } = user;
    return this.tripService.getAllTrips(organizationId);
  }
}
