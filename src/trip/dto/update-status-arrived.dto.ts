import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusArrivedDto {
  @ApiProperty({
    type: String,
    default: new Date().toISOString(),
    description: 'Arrived time of the trip',
    example: '2023-02-10T12:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  arrivedTime: string;
}
