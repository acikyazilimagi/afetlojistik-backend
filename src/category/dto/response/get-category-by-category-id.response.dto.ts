import { ApiProperty } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';
import { CategoryResponseDto } from './common/category.response.dto';

export class GetCategoryByCategoryIdResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: CategoryResponseDto;
}
