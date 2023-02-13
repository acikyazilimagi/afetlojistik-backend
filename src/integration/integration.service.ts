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
    private readonly integrationModel: Model<Integration>
  ) {
    logger.setContext(IntegrationService.name);
  }

  @LogMe()
  async getIntegrations(): Promise<IntegrationDocument[]> {
    return await this.integrationModel.find({});
  }

  @LogMe()
  async getIntegrationById(
    integrationId: string
  ): Promise<IntegrationDocument> {
    const integration: IntegrationDocument | null =
      await this.integrationModel.findById(integrationId);

    if (!integration) throw new IntegrationNotFoundException({ integrationId });

    return integration;
  }

  @LogMe()
  async getPriorIntegration(): Promise<IntegrationDocument> {
    const integration: IntegrationDocument | null =
      await this.integrationModel.findOne({ priority: true });

    if (!integration) throw new IntegrationNotFoundException({});

    return integration;
  }

  @LogMe()
  async setPriorIntegration(
    integrationId: string
  ): Promise<IntegrationDocument> {
    let integration: IntegrationDocument | null = null;

    await this.integrationModel.updateMany({
      $set: { priority: false },
    });

    integration = await this.integrationModel.findByIdAndUpdate(
      integrationId,
      {
        $set: { priority: true },
      },
      { new: true }
    );

    if (!integration) throw new IntegrationNotFoundException({});

    return integration;
  }
}
