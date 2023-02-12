import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform((value) => value.toString())
  @IsPhoneNumber('TR')
  @ApiProperty({
    description: 'Phone Number',
    example: '5320000000',
  })
  phone: string;
}
