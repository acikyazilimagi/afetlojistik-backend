import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class GetDistrictsOfCity {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() __v: number;
}

export class GetDistrictsOfCityResponseDto {
  @ApiProperty({ type: GetDistrictsOfCity, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: GetDistrictsOfCity[];
}
