import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from 'src/common/decorators/log.decorator';
import { IntegrationNotFoundException } from './exceptions/integration.exceptions';
import { Integration, IntegrationDocument } from './schemas/integration.schema';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Integration.name)
    private readonly integrationModel: Model<IntegrationDocument>
  ) {
    logger.setContext(IntegrationService.name);
  }

  @LogMe()
  async getIntegrations(): Promise<{ integrations: IntegrationDocument[] }> {
    const integrations = await this.integrationModel.find({});

    return { integrations };
  }

  @LogMe()
  async getIntegrationById(
    integrationId: string
  ): Promise<{ integration: IntegrationDocument }> {
    const integration = await this.integrationModel.findById(integrationId);

    if (!integration) throw new IntegrationNotFoundException({ integrationId });

    return { integration };
  }

  @LogMe()
  async getPriorIntegration(): Promise<{ integration: IntegrationDocument }> {
    const integration = await this.integrationModel.findOne({ priority: true });

    if (!integration) throw new IntegrationNotFoundException({});

    return { integration };
  }

  @LogMe()
  async setPriorIntegration(
    integrationId: string
  ): Promise<{ integration: IntegrationDocument }> {
    await this.integrationModel.updateMany({
      $set: { priority: false },
    });

    const integration = await this.integrationModel.findByIdAndUpdate(
      integrationId,
      {
        $set: { priority: true },
      },
      { new: true }
    );

    if (!integration) throw new IntegrationNotFoundException({});

    return { integration };
  }
}
