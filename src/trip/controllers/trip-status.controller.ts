import {
  Controller,
  UseGuards,
  Headers,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../../user/guards/user.guard';
import { TokenHeader } from '../../common/headers/token.header';
import { User } from '../../user/decorators/user.decorator';
import { UserDocument } from '../../user/schemas/user.schema';
import { TripDocument } from '../schemas/trip.schema';
import { TripStatusService } from '../services/trip-status.service';
import { UpdateStatusOnwayDto } from '../dto/update-status-onway.dto';
import { UpdateStatusArrivedDto } from '../dto/update-status-arrived.dto';

@ApiTags('Trip Statuses')
@Controller('trip')
export class TripStatusController {
  constructor(private readonly tripStatusService: TripStatusService) {}

  @Patch(':tripId/status/onway')
  @ApiOperation({ summary: 'Update trip status to onway.' })
  @UseGuards(UserAuthGuard)
  updateTripStatusToOnway(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string,
    @Body() updateStatusOnwayDto: UpdateStatusOnwayDto
  ): Promise<TripDocument> {
    const { organizationId, _id: userId } = user;
    return this.tripStatusService.updateTripStatusOnway(
      tripId,
      userId,
      organizationId,
      updateStatusOnwayDto
    );
  }

  @Patch(':tripId/status/arrived')
  @ApiOperation({ summary: 'Update trip status to arrived.' })
  @UseGuards(UserAuthGuard)
  updateTripStatusToArrived(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string,
    @Body() updateStatusArrivedDto: UpdateStatusArrivedDto
  ): Promise<TripDocument> {
    const { organizationId, _id: userId } = user;
    return this.tripStatusService.updateTripStatusArrived(
      tripId,
      userId,
      organizationId,
      updateStatusArrivedDto
    );
  }

  @Patch(':tripId/status/cancelled')
  @ApiOperation({ summary: 'Update trip status to cancelled.' })
  @UseGuards(UserAuthGuard)
  updateTripStatusToCancelled(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string
  ): Promise<TripDocument> {
    const { organizationId, _id: userId } = user;
    return this.tripStatusService.updateTripStatusCancelled(
      tripId,
      userId,
      organizationId
    );
  }
}
