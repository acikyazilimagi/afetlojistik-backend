import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Limit of data to be returned.',
    required: false,
    default: Number.MAX_SAFE_INTEGER,
  })
  @IsOptional()
  @IsNumber()
  @Transform((object) => Number.parseInt(object.value, 10))
  limit: number;

  @ApiProperty({
    description: 'Cursor position to start the search.',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Transform((object) => Number.parseInt(object.value, 10))
  skip: number;
}
