import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class Plate {
  @ApiProperty() @IsString() truck: string;
  @ApiProperty() @IsArray() trailer: string;
}

class Vehicle {
  @ApiProperty() @IsString() plateNumber: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() phone: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  plate: Plate;
}

class FromLocation {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() districtId: string;
}

class ToLocation {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() districtId: string;
}

class StatusChangeLog {
  @ApiProperty() @IsString() createdBy: string;
  @ApiProperty() @IsNumber() status: number;
  @ApiProperty() @IsDate() createdAt: Date;
}

class Product {
  @ApiProperty() @IsString() categoryId: string;
  @ApiProperty() @IsNumber() count: number;
}

class GetTripByTripNumber {
  @ApiProperty() @IsNumber() status: number;
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() organizationId: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  vehicle: Vehicle;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  fromLocation: FromLocation;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  toLocation: ToLocation;

  @ApiProperty() @IsString() createdBy: string;

  @ApiProperty({ type: StatusChangeLog, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  statusChangeLog: StatusChangeLog[];

  @ApiProperty() @IsDate() estimatedDepartTime: Date;

  @ApiProperty({ type: Product, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  products: Product[];

  @ApiProperty() @IsDate() createdAt: Date;
  @ApiProperty() @IsDate() updatedAt: Date;
  @ApiProperty() @IsNumber() tripNumber: number;
}

export class GetTripByTripNumberResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: GetTripByTripNumber;
}
