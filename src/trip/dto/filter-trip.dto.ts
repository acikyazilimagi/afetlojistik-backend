import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripsStatuses } from '../types/trip.type';

export class FilterTripDto {
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Trip statuses',
    example: [100, 200, 300, 400, 500],
  })
  statuses: TripsStatuses[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Plate number of the vehicle',
    example: '34ABC123',
  })
  plateNumber: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Driver phone number of the vehicle',
  })
  driverPhone: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Driver name of the vehicle',
    example: 'John Doe',
  })
  driverName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'UserId for created by',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  createdBy: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'CityId of the fromLocation',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  fromCityId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'DistrictId of the fromLocation',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  fromDistrictId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'CityId of the toLocation',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  toCityId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'DistrictId of the toLocation',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  toDistrictId: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Product Category Ids',
    example: ['5e43fc64ad9beb36cdeb4f8b', '5e43fc64ad9beb36cdeb4f8b'],
  })
  productCategoryIds: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Start date of the create trip',
    example: '2020-04-01T00:00:00.000Z',
  })
  startDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'End date of the create trip',
    example: '2020-04-01T00:00:00.000Z',
  })
  endDate: string;
}
