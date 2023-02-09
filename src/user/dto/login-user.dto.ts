import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('TR')
  @ApiProperty({
    description: 'Phone Number',
    example: '+905388343394',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  password: string;
}
