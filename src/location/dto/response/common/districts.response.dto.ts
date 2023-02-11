import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DistrictsResponseDto {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() __v: number;
}
