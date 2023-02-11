import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { CategoryResponseDto } from './common/category.response.dto';

export class GetAllCategoriesResponseDto {
  @ApiProperty({ type: CategoryResponseDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  data: CategoryResponseDto[];

  @ApiProperty() @IsNumber() total: number;
}
