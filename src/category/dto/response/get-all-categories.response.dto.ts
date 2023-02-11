import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class Categories {
  @ApiProperty() @IsArray() subCategories: [];
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() organizationId: string;
}

export class GetAllCategoriesResponseDto {
  @ApiProperty({ type: Categories, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: Categories[];

  @ApiProperty() @IsNumber() total: number;
}
