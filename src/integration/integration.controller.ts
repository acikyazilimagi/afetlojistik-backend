import { Controller, Get, Headers ,Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenHeader } from 'src/common/headers/token.header';
import { IntegrationService } from './integration.service';

@ApiTags('Integration')
@Controller('integration')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService
  ){}

  @Get('')
  @ApiOperation({ summary: 'Get all integrators' })
  getIntegrations(@Headers() tokenHeader: TokenHeader): Promise<any> {
    return this.integrationService.getIntegrations();
  }

  @Get(':integrationId')
  @ApiOperation({ summary: 'Get integration by integrationId' })
  getIntegrationById(
    @Headers() tokenHeader: TokenHeader,
    @Param('integrationId') integrationId: string,
    ): Promise<any> {
    return this.integrationService.getIntegrationById(integrationId);
  }
}