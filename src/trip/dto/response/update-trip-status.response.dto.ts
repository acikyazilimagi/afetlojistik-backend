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
}

class Vehicle {
  plate: Plate;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() phone: string;
}

class FromLocation {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() districtId: string;
  @ApiProperty() @IsString() address: string;
}

class ToLocation {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() districtId: string;
  @ApiProperty() @IsString() address: string;
}

class StatusChangeLog {
  @ApiProperty() @IsString() createdBy: string;
  @ApiProperty() @IsNumber() status: number;
  createdAt: Date;
}

class Product {
  @ApiProperty() @IsString() categoryId: string;
  @ApiProperty() @IsNumber() count: number;
}

class UpdateTripStatus {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() organizationId: string;
  @ApiProperty() @IsNumber() status: number;

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

  @ApiProperty() @IsNumber() createdBy: string;

  @ApiProperty({ type: StatusChangeLog, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  statusChangeLog: StatusChangeLog[];

  @ApiProperty() @IsDate() estimatedDepartTime: Date;
  @ApiProperty() @IsString() notes: string;

  @ApiProperty({ type: Product, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  products: Product[];

  @ApiProperty() @IsDate() createdAt: Date;
  @ApiProperty() @IsDate() updatedAt: Date;
  @ApiProperty() @IsString() tripNumber: number;
}

export class UpdateTripStatusResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: UpdateTripStatus;
}
