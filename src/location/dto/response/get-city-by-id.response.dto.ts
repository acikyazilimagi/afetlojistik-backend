import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class GetCityById {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() __v: number;
}

export class GetCityByIdResponseDto {
  @ApiProperty({ type: GetCityById, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: GetCityById[];
}
