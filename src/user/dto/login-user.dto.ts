import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('TR')
  @ApiProperty({
    description: 'Phone Number',
    example: '5388343394',
  })
  phone: string;
}
