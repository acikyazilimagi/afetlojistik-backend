import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

import { Health } from './health.types';

@Controller('health')
@ApiTags('Health Check')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check for the service.' })
  @ApiResponse({
    status: 200,
    type: Health,
    description: 'Service Health Status',
  })
  health(): Health {
    return this.healthService.health();
  }
}
