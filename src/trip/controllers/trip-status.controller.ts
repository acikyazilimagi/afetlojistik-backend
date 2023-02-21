import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActiveUserAuthGuard, JwtAuthGuard } from 'src/auth/guards';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { UpdateStatusArrivedDto } from '../dto/update-status-arrived.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { TripDocument } from '../schemas/trip.schema';
import { TripStatusService } from '../services/trip-status.service';

@UseInterceptors(TransformResponseInterceptor)
@ApiTags('Trip Statuses')
@Controller('trip')
@UseGuards(JwtAuthGuard, ActiveUserAuthGuard)
export class TripStatusController {
  constructor(private readonly tripStatusService: TripStatusService) {}

  @Patch(':tripId/status/onway')
  @ApiOperation({ summary: 'Update trip status to onway.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripDto })
  updateTripStatusToOnway(
    @Req() req,
    @Param('tripId') tripId: string
  ): Promise<TripDocument> {
    const { organizationId, id: userId } = req.user;
    return this.tripStatusService.updateTripStatusOnway(
      tripId,
      userId,
      organizationId
    );
  }

  @Patch(':tripId/status/arrived')
  @ApiOperation({ summary: 'Update trip status to arrived.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripDto })
  updateTripStatusToArrived(
    @Req() req,
    @Param('tripId') tripId: string,
    @Body() updateStatusArrivedDto: UpdateStatusArrivedDto
  ): Promise<TripDocument> {
    const { organizationId, id: userId } = req.user;
    return this.tripStatusService.updateTripStatusArrived(
      tripId,
      userId,
      organizationId,
      updateStatusArrivedDto
    );
  }

  @Patch(':tripId/status/cancelled')
  @ApiOperation({ summary: 'Update trip status to cancelled.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripDto })
  updateTripStatusToCancelled(
    @Req() req,
    @Param('tripId') tripId: string
  ): Promise<TripDocument> {
    const { organizationId, id: userId } = req.user;
    return this.tripStatusService.updateTripStatusCancelled(
      tripId,
      userId,
      organizationId
    );
  }
}
