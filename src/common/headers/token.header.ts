import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenHeader {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token Code',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjU0NDgwODQ0MDUiLCJpYXQiOjE2NzYwODE5OTksImV4cCI6MTY3NjA4MjA1OX0.GfyUIIg0_X0sQkXfDnF1klk2PavO7CHwi35k7BI5-2M"',
  })
  token: string;
}
