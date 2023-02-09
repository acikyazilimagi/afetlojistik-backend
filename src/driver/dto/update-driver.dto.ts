import { CreateDriverDto } from './create-driver.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDriverDto extends CreateDriverDto {
  @ApiProperty({
    description: 'Kvkk Approval',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  kvkkApproval?: boolean;
}
