import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Plate {
  @ApiProperty() @IsString() truck: string;
  @ApiProperty() @IsArray() trailer: string;
}

export class Vehicle {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  plate: Plate;

  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() phone: string;
}

export class FromLocation {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() districtId: string;
  @ApiProperty() @IsString() address: string;
}

export class ToLocation {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() districtId: string;
  @ApiProperty() @IsString() address: string;
}

export class StatusChangeLog {
  @ApiProperty() @IsString() createdBy: string;
  @ApiProperty() @IsNumber() status: number;
  @ApiProperty() @IsDate() createdAt: Date;
}

export class ProductObject {
  @ApiProperty() @IsString() categoryId: string;
  @ApiProperty() @IsNumber() count: number;
}

export class CreateTrip {
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

  @ApiProperty() @IsString() createdBy: string;

  @ApiProperty({ type: StatusChangeLog, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  statusChangeLog: StatusChangeLog[];

  @ApiProperty() @IsDate() estimatedDepartTime: Date;
  @ApiProperty() @IsString() notes: string;

  @ApiProperty({ type: ProductObject, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  products: ProductObject[];

  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsDate() createdAt: Date;
  @ApiProperty() @IsDate() updatedAt: Date;
  @ApiProperty() @IsNumber() tripNumber: number;
}

export class CreateTripResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: CreateTrip;
}
