import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { IntegrationService } from './integration.service';
import { IntegrationDocument } from './schemas/integration.schema';

@ApiTags('Integration')
@UseInterceptors(TransformResponseInterceptor)
@Controller('integration')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all integrators' })
  getIntegrations(): Promise<{ integrations: IntegrationDocument[] }> {
    return this.integrationService.getIntegrations();
  }

  @Get(':integrationId')
  @ApiOperation({ summary: 'Get integration by integrationId' })
  getIntegrationById(
    @Param('integrationId') integrationId: string
  ): Promise<{ integration: IntegrationDocument }> {
    return this.integrationService.getIntegrationById(integrationId);
  }
}
