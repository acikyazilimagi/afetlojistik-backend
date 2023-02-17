import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class UserResponseDto {
  @ApiProperty() @IsArray() roles: [];
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsBoolean() active: boolean;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() surname: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty() @IsString() organizationId: string;
}
