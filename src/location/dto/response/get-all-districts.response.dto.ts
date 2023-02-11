import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class GetAllDistricts {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() __v: number;
}

export class GetAllDistrictsResponseDto {
  @ApiProperty({ type: GetAllDistricts, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: GetAllDistricts[];
}
