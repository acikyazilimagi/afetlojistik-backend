import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @Matches('^5[0-9]{9}$')
  phone: string;

  @ApiProperty({
    type: String,
    description: 'Email of user',
    example: 'test@domain.com',
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({
    type: Boolean,
    description: 'Admin role of user',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Activeness of user',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
