import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from 'src/common/decorators/log.decorator';
import { IntegrationService } from 'src/integration/integration.service';
import { Integrators } from 'src/integration/types/integration.types';
import { DispatchDto } from './dtos/dispatch.dto';
import {
  InvalidDispatchException,
  InvalidDispatchIntegrationException,
} from './exceptions/dispatch.exceptions';
import { DispatchFormatter } from './formatters/dispatch.formatter';
import { OptiyolServiceClient } from './optiyol.service-client';
import { Dispatch, DispatchDocument } from './schema/dispatch.schema';
import { DispatchableOrder, DispatchableVehicle } from './types/dispatch.types';
import {
  OptiyolDispatchOrderResult,
  OptiyolDispatchVehicleResult,
} from './types/optiyol.types';

@Injectable()
export class DispatchService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Dispatch.name)
    private readonly dispatchModel: Model<DispatchDocument>,
    private readonly integrationService: IntegrationService,
    private readonly optiyolServiceClient: OptiyolServiceClient
  ) {}

  @LogMe()
  async dispatchTrip(data: DispatchableOrder): Promise<void> {
    const { integration } = await this.integrationService.getPriorIntegration();

    if (integration.integrator === Integrators.OPTIYOL) {
      const dispatchOrder = DispatchFormatter.formatDispatchOrder(data);

      if (!dispatchOrder) {
        throw new InvalidDispatchException({ data });
      }

      let optiyolResult: OptiyolDispatchOrderResult | unknown;
      try {
        optiyolResult = await this.optiyolServiceClient.sendDispatchOrder(
          dispatchOrder
        );
      } catch (error: unknown) {
        optiyolResult = (error as AxiosError).response.data;
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

  @LogMe()
  async dispatchVehicle(data: DispatchableVehicle): Promise<void> {
    const { integration } = await this.integrationService.getPriorIntegration();

    if (integration.integrator === Integrators.OPTIYOL) {
      const dispatchVehicle = DispatchFormatter.formatDispatchVehicle(data);

      if (!dispatchVehicle) {
        throw new InvalidDispatchException({ data });
      }

      let optiyolResult: OptiyolDispatchVehicleResult | unknown;
      try {
        optiyolResult = await this.optiyolServiceClient.sendDispatchVehicle(
          dispatchVehicle
        );
      } catch (error: unknown) {
        optiyolResult = (error as AxiosError).response.data;
      } finally {
        const dispatch: DispatchDto = {
          integrator: integration.integrator,
          vehicle: dispatchVehicle,
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
