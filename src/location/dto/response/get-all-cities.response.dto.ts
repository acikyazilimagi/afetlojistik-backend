import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class GetAllCities {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() __v: number;
}

export class GetAllCitiesResponseDto {
  @ApiProperty({ type: GetAllCities, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: GetAllCities[];
}
