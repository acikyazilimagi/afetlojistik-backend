import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
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
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  plate: Plate;

  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() phone: string;
}

class FromLocationObject {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() districtId: string;
  @ApiProperty() @IsString() address: string;
  @ApiProperty() @IsString() cityName: string;
  @ApiProperty() @IsString() districtName: string;
}
class ToLocationObject {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsString() districtId: string;
  @ApiProperty() @IsString() address: string;
  @ApiProperty() @IsString() cityName: string;
  @ApiProperty() @IsString() districtName: string;
}

class CreatedByObject {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsBoolean() active: boolean;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() surname: string;
  @ApiProperty() @IsString() phone: string;
}

class StatusChangeLogObject {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  createdBy: CreatedByObject;

  @ApiProperty() @IsString() status: number;
  @ApiProperty() @IsDate() createdAt: Date;
}

class Product {
  @ApiProperty() @IsString() categoryId: string;
  @ApiProperty() @IsNumber() count: number;
  @ApiProperty() @IsString() categoryName: string;
}

class GetTripByTripId {
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
  fromLocation: FromLocationObject;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  toLocation: ToLocationObject;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  createdBy: CreatedByObject;

  @ApiProperty({ type: StatusChangeLogObject, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  statusChangeLog: StatusChangeLogObject[];

  @ApiProperty() @IsDate() estimatedDepartTime: Date;
  @ApiProperty() @IsString() notes: string;

  @ApiProperty({ type: Product, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  products: Product[];

  @ApiProperty() @IsDate() createdAt: Date;
  @ApiProperty() @IsDate() updatedAt: Date;
  @ApiProperty() @IsNumber() tripNumber: number;
}

export class GetTripByTripIdResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: GetTripByTripId;
}
