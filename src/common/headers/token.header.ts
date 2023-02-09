import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenHeader {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token Code',
    example: '5e663971ceb0011360134d715e9d49713bf84baea3358cf2',
  })
  token: string;
}
