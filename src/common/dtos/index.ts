import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, ValidateNested } from 'class-validator';

export class SuccessResponse {
  @ApiProperty() @IsBoolean() success: boolean;
}

export class SuccessResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: SuccessResponse;
}
