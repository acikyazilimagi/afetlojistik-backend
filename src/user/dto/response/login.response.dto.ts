import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, ValidateNested } from 'class-validator';

export class LoginResponse {
  @ApiProperty() @IsBoolean() success: boolean;
}

export class LoginResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: LoginResponse;
}
