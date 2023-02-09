import { IsDate, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Vehicle {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('TR')
  @ApiProperty({
    description: 'Plate number of the vehicle',
    example: '34ABC123',
  })
  plateNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Driver of the vehicle',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  driverId: string;
}

class Location {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'CityId of the location',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  cityId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'DistrictId of the location',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  districtId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Address of the location',
    example: 'Atatürk Mahallesi, 123 Sokak, No: 1',
  })
  address: string;
}

class Products {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category id',
    example: '5e43fc64ad9beb36cdeb4f8b',
  })
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product count',
    example: '5',
  })
  count: string;
}
export class CreateTripDto {
  @ApiProperty({
    description: 'Vehicle of the trip',
    example: {
      plateNumber: '34ABC123',
      driverId: '5e43fc64ad9beb36cdeb4f8b',
    },
  })
  @IsNotEmpty()
  vehicle: Vehicle;

  @ApiProperty({
    description: 'From location of the trip',
    example: {
      cityId: '5e43fc64ad9beb36cdeb4f8b',
      districtId: '5e43fc64ad9beb36cdeb4f8b',
      address: 'Atatürk Mahallesi, 123 Sokak, No: 1',
    }
  })
  @IsNotEmpty()
  fromLocation: Location;

  @ApiProperty({
    description: 'To location of the trip',
    example: {
      cityId: '5e43fc64ad9beb36cdeb4f8b',
      districtId: '5e43fc64ad9beb36cdeb4f8b',
      address: 'Atatürk Mahallesi, 123 Sokak, No: 1',
    },
  })
  @IsNotEmpty()
  toLocation: Location;

  @ApiProperty({
    description: 'Estimated depart time of the trip',
    example: '2020-02-20T12:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  estimatedDepartTime: Date;

  @ApiProperty({
    description: 'Products of the trip',
    example: [
      {
        categoryId: '5e43fc64ad9beb36cdeb4f8b',
        count: '5',
      },
    ],
  })
  @IsNotEmpty()
  products: Products[];
}
