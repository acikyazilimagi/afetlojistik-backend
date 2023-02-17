import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserResponseDto } from './user.response.dto';

export class FilterUsersResponseDto {
  @ApiProperty({
    type: () => [UserResponseDto],
  })
  @Type(() => UserResponseDto)
  data: UserResponseDto[];

  @ApiProperty()
  total: number;
}
