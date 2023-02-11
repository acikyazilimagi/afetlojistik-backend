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
import { Prop } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Name of user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Surname of user',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({
    type: String,
    description: 'Phone of user',
    example: '5553332211',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
    description: 'Email of user',
    example: 'test@domain.com',
  })
  @IsOptional()
  @IsString({ always: false })
  email: string;

  @Prop({
    type: mSchema.Types.ObjectId,
    required: true,
  })
  organizationId: string;
}
