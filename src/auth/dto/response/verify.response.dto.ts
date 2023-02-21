import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { UserResponseDto } from './user.response.dto';

class VerifyResponse {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  user: UserResponseDto;

  @ApiProperty() @IsString() token: string;
}

export class VerifyResponseDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  data: VerifyResponse;
}
