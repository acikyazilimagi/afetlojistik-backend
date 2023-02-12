import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('TR')
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
