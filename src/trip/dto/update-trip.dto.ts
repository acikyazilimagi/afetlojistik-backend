import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { TripsStatuses } from '../types/trip.type';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @ApiProperty({
    description: 'Status of the trip',
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  status: TripsStatuses;
}
