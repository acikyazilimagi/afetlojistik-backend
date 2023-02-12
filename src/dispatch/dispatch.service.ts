import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from 'src/common/decorators/log.decorator';
import { IntegrationService } from 'src/integration/integration.service';
import { IntegrationDocument } from 'src/integration/schemas/integration.schema';
import { Integrators } from 'src/integration/types/integration.types';
import { DispatchDto, DispatchOrderDto } from './dtos/dispatch.dto';
import { InvalidDispatchException, InvalidDispatchIntegrationException } from './exceptions/dispatch.exceptions';
import { DispatchFormatter } from './formatters/dispatch.formatter';
import { OptiyolServiceClient } from './optiyol.service-client';
import { Dispatch } from './schema/dispatch.schema';
import { IDispatchable } from './types/dispatch.types';
import { OptiyolDispatchOrderResult } from './types/optiyol.types';

@Injectable()
export class DispatchService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Dispatch.name)
    private readonly dispatchModel: Model<Dispatch>,
    private readonly integrationService: IntegrationService,
    private readonly optiyolServiceClient: OptiyolServiceClient,
  ){}

  @LogMe()
  async dispatch(data: IDispatchable): Promise<void> {
    const integration: IntegrationDocument = await this.integrationService.getPriorIntegration();

    if (integration.integrator === Integrators.OPTIYOL) {
      const dispatchOrder: DispatchOrderDto = DispatchFormatter.formatDispatch(integration, data);

      if (!dispatchOrder) {
        throw new InvalidDispatchException({ data });
      }

      let optiyolResult: (OptiyolDispatchOrderResult | Error );
      try {
        optiyolResult = await this.optiyolServiceClient.sendDispatchOrder(dispatchOrder);
      } catch(error: unknown) {
        optiyolResult = (error) as Error
      } finally {
        const dispatch: DispatchDto = {
          integrator: integration.integrator,
          order: dispatchOrder,
          orderType: data.OrderType,
          result: { result: optiyolResult },
        };
        await this.dispatchModel.create(dispatch);
      }
    } else {
      throw new InvalidDispatchIntegrationException({ data });
    }
  }
}