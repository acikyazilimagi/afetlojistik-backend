import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { UserStatuses } from '../types';

export class FilterUserBodyDto {
  @ApiProperty({
    description: 'User ids',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  ids?: string[];

  @ApiProperty({
    type: String,
    description: 'Name of user',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: String,
    description: 'Surname of user',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({
    type: String,
    description: 'Phone of user',
    example: '5553332211',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    enum: [UserStatuses],
    description: 'User statuses',
    example: [UserStatuses.VERIFIED],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserStatuses, { each: true })
  statuses?: UserStatuses[];

  @ApiProperty({
    type: String,
    description: 'Email of user',
    example: 'test@domain.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    type: [Boolean],
    description: 'Admin role of user',
    example: [true],
  })
  @IsOptional()
  @IsArray()
  @IsBoolean({ each: true })
  isAdmin?: boolean[];

  @ApiProperty({
    type: [Boolean],
    description: 'Activeness of user',
    example: [true],
  })
  @IsOptional()
  @IsArray()
  @IsBoolean({ each: true })
  activeness?: boolean[];
}

export class FilterUserDto extends IntersectionType(
  FilterUserBodyDto,
  PaginationDto
) {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  organizationId: string;
}
