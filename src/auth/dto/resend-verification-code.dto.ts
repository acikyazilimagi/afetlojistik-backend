import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ResendVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  @Matches('^5[0-9]{9}$')
  @ApiProperty({
    description: 'Phone Number',
    example: '5320000000',
  })
  phone: string;
}
