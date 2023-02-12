import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RawAxiosRequestHeaders } from 'axios';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from 'src/common/decorators/log.decorator';
import { DispatchOrderDto } from 'src/dispatch/dtos/dispatch.dto';
import { OptiyolDispatchOrderResult } from './types/optiyol.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OptiyolServiceClient {
  constructor(
    protected readonly logger: PinoLogger,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ){
    this.logger.setContext(OptiyolServiceClient.name);
  }

  @LogMe()
  async sendDispatchOrder(dispatchOrder: DispatchOrderDto): Promise<OptiyolDispatchOrderResult> {
    const authHeaders = {
      Authorization: `token ${this.config.get<string>('optiyol.token')}`,
      'optiyol-company': this.config.get<string>('optiyol.company'),
    } as Partial<RawAxiosRequestHeaders>;

    const { data: response}: { data: OptiyolDispatchOrderResult } = await this.httpService.axiosRef.post<OptiyolDispatchOrderResult, any>(
      'core/create-unplanned/orders/',
      { ...dispatchOrder },
      { headers: { ...authHeaders }}
    );

    return response;
  }
}
