import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CategoryResponseDto {
  @ApiProperty() @IsArray() subCategories: [];
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() organizationId: string;
}
