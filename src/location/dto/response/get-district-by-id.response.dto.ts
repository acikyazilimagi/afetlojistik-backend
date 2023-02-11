import { ApiProperty } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';
import { DistrictsResponseDto } from './common/districts.response.dto';

export class GetDistrictByIdResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: DistrictsResponseDto;
}
