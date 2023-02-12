import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches('^5[0-9]{9}$')
  @ApiProperty({
    description: 'Phone Number',
    example: '5320000000',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'OTP Code',
    example: '123456',
  })
  code: string;
}
