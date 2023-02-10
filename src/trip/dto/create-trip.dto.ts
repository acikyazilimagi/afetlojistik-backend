import {
  IsArray,
  IsDateString,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { NestedObjectValidator } from 'src/common/decorators/nested-object-validator.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class VehicleDto {
  @ApiProperty({
    type: String,
    description: 'Plate number of the vehicle',
    example: '34ABC123',
  })
  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @ApiProperty({
    type: String,
    description: 'Driver phone number of the vehicle',
    example: '5388343394',
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('TR')
  phone: string;

  @ApiProperty({
    description: 'Driver name of the vehicle',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class LocationDto {
  @ApiProperty({
    type: String,
    description: 'CityId of the location',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  cityId: string;

  @ApiProperty({
    type: String,
    description: 'DistrictId of the location',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  districtId: string;

  @ApiProperty({
    type: String,
    description: 'Address of the location',
    example: 'Atatürk Mahallesi, 123 Sokak, No: 1',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class ProductDto {
  @ApiProperty({
    description: 'Category id',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  categoryId: string;

  @ApiProperty({
    type: Number,
    description: 'Product count',
    example: '5',
  })
  @IsDefined()
  @IsNumber()
  @Min(0)
  count: number;
}
export class CreateTripDto {
  @ApiProperty({
    type: VehicleDto,
    description: 'Vehicle of the trip',
    example: {
      plateNumber: '34ABC123',
      phone: '5388343394',
      name: 'John Doe',
    },
  })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested({ message: 'Invalid Vehicle'})
  @Type(() => VehicleDto)
  vehicle: VehicleDto;

  @ApiProperty({
    type: LocationDto,
    description: 'From location of the trip',
    example: {
      cityId: '5e43fc64ad9beb36cdeb4f8b',
      districtId: '5e43fc64ad9beb36cdeb4f8b',
      address: 'Atatürk Mahallesi, 123 Sokak, No: 1',
    },
  })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested({ message: 'Invalid from Location' })
  @Type(() => LocationDto)
  fromLocation: LocationDto;

  @ApiProperty({
    type: LocationDto,
    description: 'To location of the trip',
    example: {
      cityId: '5e43fc64ad9beb36cdeb4f8b',
      districtId: '5e43fc64ad9beb36cdeb4f8b',
      address: 'Atatürk Mahallesi, 123 Sokak, No: 1',
    },
  })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested({ message: 'Invalid to Location' })
  @Type(() => LocationDto)
  toLocation: LocationDto;

  @ApiProperty({
    type: String,
    default: new Date().toISOString(),
    description: 'Estimated depart time of the trip',
    example: '2023-02-10T12:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  estimatedDepartTime: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Attached note for this trip',
    example: '"Please contact with ... person on arrival"'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    type: [ProductDto],
    description: 'Products of the trip',
    example: [
      {
        categoryId: '5e43fc64ad9beb36cdeb4f8b',
        count: 5,
      },
    ],
  })
  @IsDefined()
  @IsArray()
  @NestedObjectValidator(ProductDto, { each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
