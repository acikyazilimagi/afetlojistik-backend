import { ApiProperty } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';

import { TripResponseDto } from './common/trip.response.dto';

export class CreateTripResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: TripResponseDto;
}
