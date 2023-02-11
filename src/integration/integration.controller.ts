import { Controller, Get, Headers ,Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenHeader } from 'src/common/headers/token.header';
import { UserAuthGuard } from 'src/user/guards/user.guard';
import { IntegrationService } from './integration.service';

@ApiTags('Integration')
@Controller('integration')
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService
  ){}

  @Get('')
  @ApiOperation({ summary: 'Get all integrators' })
  //@UseGuards(UserAuthGuard)
  getIntegrations(@Headers() tokenHeader: TokenHeader): Promise<any> {
    return this.integrationService.getIntegrations();
  }

  @Get(':integrationId')
  @ApiOperation({ summary: 'Get integration by integrationId' })
  //@UseGuards(UserAuthGuard)
  getIntegrationById(
    @Headers() tokenHeader: TokenHeader,
    @Param('integrationId') integrationId: string,
    ): Promise<any> {
    return this.integrationService.getIntegrationById(integrationId);
  }
}