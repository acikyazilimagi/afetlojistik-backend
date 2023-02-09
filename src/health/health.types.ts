import { ApiProperty } from '@nestjs/swagger';

export class Health {
  @ApiProperty({
    example: 1628341997563,
    description: 'Timestamp',
  })
  time: number;

  @ApiProperty({
    example: 'Ok',
    description: 'Service Status',
  })
  status: string;
}
