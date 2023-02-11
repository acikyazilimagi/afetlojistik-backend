import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { DistrictsResponseDto } from './common/districts.response.dto';

export class GetAllDistrictsResponseDto {
  @ApiProperty({ type: DistrictsResponseDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: DistrictsResponseDto[];
}
