import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
export class ResendVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('TR')
  @ApiProperty({
    description: 'Phone Number',
    example: '5320000000',
  })
  phone: string;
}
