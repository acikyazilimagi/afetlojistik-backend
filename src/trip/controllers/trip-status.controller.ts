import {
  Controller,
  UseGuards,
  Headers,
  Param,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../../user/guards/user.guard';
import { TokenHeader } from '../../common/headers/token.header';
import { User } from '../../user/decorators/user.decorator';
import { UserDocument } from '../../user/schemas/user.schema';
import { TripDocument } from '../schemas/trip.schema';
import { TripStatusService } from '../services/trip-status.service';
import { UpdateTripResponseDto } from '../dto/response';

@ApiTags('Trip Statuses')
@Controller('trip')
export class TripStatusController {
  constructor(private readonly tripStatusService: TripStatusService) {}

  @Patch(':tripId/status/onway')
  @ApiOperation({ summary: 'Update trip status to onway.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripResponseDto })
  @UseGuards(UserAuthGuard)
  updateTripStatusToOnway(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string
  ): Promise<TripDocument> {
    const { organizationId, _id: userId } = user;
    return this.tripStatusService.updateTripStatusOnway(
      tripId,
      userId,
      organizationId
    );
  }

  @Patch(':tripId/status/arrived')
  @ApiOperation({ summary: 'Update trip status to arrived.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripResponseDto })
  @UseGuards(UserAuthGuard)
  updateTripStatusToArrived(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string
  ): Promise<TripDocument> {
    const { organizationId, _id: userId } = user;
    return this.tripStatusService.updateTripStatusArrived(
      tripId,
      userId,
      organizationId
    );
  }

  @Patch(':tripId/status/complete')
  @ApiOperation({ summary: 'Update trip status to complete.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripResponseDto })
  @UseGuards(UserAuthGuard)
  updateTripStatusToComplete(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('tripId') tripId: string
  ): Promise<TripDocument> {
    const { organizationId, _id: userId } = user;
    return this.tripStatusService.updateTripStatusCompleted(
      tripId,
      userId,
      organizationId
    );
  }

  @Patch(':tripId/status/cancelled')
  @ApiOperation({ summary: 'Update trip status to cancelled.' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTripResponseDto })
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
