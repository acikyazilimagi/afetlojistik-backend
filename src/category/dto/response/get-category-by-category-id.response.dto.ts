import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';

class Categories {
  @ApiProperty() @IsArray() subCategories: [];
  @ApiProperty() @IsString() _id: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() organizationId: string;
}

export class GetCategoryByCategoryIdResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: Categories;
}
