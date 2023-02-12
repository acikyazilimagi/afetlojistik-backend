import { Injectable } from '@nestjs/common';
import { RawAxiosRequestHeaders } from 'axios';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from 'src/common/decorators/log.decorator';
import { DispatchOrderDto } from 'src/dispatch/dtos/dispatch.dto';
import { AbstractServiceClient } from '../bootstrap-modules/service-client/base.service-client';
import { OptiyolDispatchOrderResult } from './types/optiyol.types';

@Injectable()
export class OptiyolServiceClient extends AbstractServiceClient {
  constructor(
    protected readonly logger: PinoLogger
  ){
    super(
      'Optiyol',
      process.env.INTEGRATION_OPTIYOL_URL || 'https://api.optiyol.com/api/',
      logger
    );
    this.logger.setContext(OptiyolServiceClient.name);
  }

  @LogMe()
  async sendDispatchOrder(dispatchOrder: DispatchOrderDto): Promise<OptiyolDispatchOrderResult> {
    const authHeaders = {
      Authorization: `token ${process.env.OPTIYOL_TOKEN}`,
      'optiyol-company': process.env.OPTIYOL_COMPANY_NAME,
    } as Partial<RawAxiosRequestHeaders>;

    return await this.request(
      'POST',
      `core/create-unplanned/orders/`,
      { dispatchOrder },
      {},
      { ...authHeaders }) as OptiyolDispatchOrderResult;
  }
}
