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
  @ApiProperty() @IsString() trailer: string;
}

export class Vehicle {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  plate: Plate;

  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() phone: string;
}

export class LocationObject {
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

export class TripResponseDto {
  @ApiProperty() @IsString() organizationId: string;
  @ApiProperty() @IsNumber() status: number;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  vehicle: Vehicle;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  fromLocation: LocationObject;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  toLocation: LocationObject;

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
