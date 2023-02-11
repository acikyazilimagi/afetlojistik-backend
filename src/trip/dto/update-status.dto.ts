import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripsStatuses } from '../types/trip.type';

export class UpdateStatusDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Trip status',
    example: 200,
  })
  status: TripsStatuses;
}
