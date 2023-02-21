import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';

export class ResponseCommonDto<T> {
  @ApiProperty()
  @ValidateNested({ each: true })
  data: T;
}

export class ResponsePaginationDto<T> {
  @ApiProperty()
  @ValidateNested({ each: true })
  data: T;

  @ApiProperty()
  @IsNumber()
  total: number;
}
