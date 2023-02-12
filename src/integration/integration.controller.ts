import { Controller, Get ,Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IntegrationService } from './integration.service';

@ApiTags('Integration')
@Controller('integration')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService
  ){}

  @Get()
  @ApiOperation({ summary: 'Get all integrators' })
  getIntegrations(): Promise<any> {
    return this.integrationService.getIntegrations();
  }

  @Get(':integrationId')
  @ApiOperation({ summary: 'Get integration by integrationId' })
  getIntegrationById(
    @Param('integrationId') integrationId: string,
    ): Promise<any> {
    return this.integrationService.getIntegrationById(integrationId);
  }
}