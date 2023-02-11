import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class User {
  @ApiProperty() @IsArray() roles: [];
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsBoolean() active: boolean;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() surname: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty() @IsString() organizationId: string;
}

class Data {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  user: User;

  @ApiProperty() @IsString() token: string;
}

export class VerifyResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: Data;
}
