import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

export class GetDistrictsOfCity {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() __v: number;
}

export class GetDistrictByIdResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: GetDistrictsOfCity;
}
