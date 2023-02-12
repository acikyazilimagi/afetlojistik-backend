import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { PopulatedTripResponseDto } from './common/populated-trip.response.dto';

export class FilterTripsResponseDto {
  @ApiProperty({ type: PopulatedTripResponseDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: PopulatedTripResponseDto[];

  @ApiProperty() @IsNumber() total: number;
}
