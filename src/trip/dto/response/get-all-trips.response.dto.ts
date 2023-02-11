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
  @ApiProperty() @IsString() plateNumber: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() phone: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  plate: Plate;
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

class CreatedBy {
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
  createdBy: CreatedBy;

  @ApiProperty() @IsNumber() status: number;
  @ApiProperty() @IsDate() createdAt: Date;
}

class ProductObject {
  @ApiProperty() @IsString() categoryId: string;
  @ApiProperty() @IsNumber() count: number;
  @ApiProperty() @IsString() categoryName: string;
}

class GetAllTrips {
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() organizationId: string;

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
  createdBy: CreatedBy;

  @ApiProperty({ type: StatusChangeLogObject, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  statusChangeLog: StatusChangeLogObject[];

  @ApiProperty() @IsDate() estimatedDepartTime: Date;

  @ApiProperty({ type: ProductObject, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  products: ProductObject[];

  @ApiProperty() @IsDate() createdAt: Date;
  @ApiProperty() @IsDate() updatedAt: Date;
  @ApiProperty() @IsNumber() tripNumber: number;
  @ApiProperty() @IsNumber() status: number;
  @ApiProperty() @IsString() notes: string;
}

export class GetAllTripsResponseDto {
  @ApiProperty({ type: GetAllTrips, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: GetAllTrips[];
  @ApiProperty() @IsNumber() total: number;
}
