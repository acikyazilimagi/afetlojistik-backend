import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RawAxiosRequestHeaders } from 'axios';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from 'src/common/decorators/log.decorator';
import {
  DispatchOrderDto,
  DispatchVehicleDto,
} from 'src/dispatch/dtos/dispatch.dto';
import {
  OptiyolDispatchOrderResult,
  OptiyolDispatchVehicleResult,
} from './types/optiyol.types';

@Injectable()
export class OptiyolServiceClient implements OnModuleInit {
  private authHeaders: Partial<RawAxiosRequestHeaders>;

  constructor(
    protected readonly logger: PinoLogger,
    private readonly config: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.logger.setContext(OptiyolServiceClient.name);
  }

  onModuleInit() {
    const optiyolToken = this.config.get<string>('optiyol.token');
    const optiyolCompany = this.config.get<string>('optiyol.company');

    this.authHeaders = {
      Authorization: `token ${optiyolToken}`,
      'optiyol-company': optiyolCompany,
    };
  }

  @LogMe()
  async sendDispatchOrder(
    dispatchOrder: DispatchOrderDto
  ): Promise<OptiyolDispatchOrderResult> {
    const { data: response }: { data: OptiyolDispatchOrderResult } =
      await this.httpService.axiosRef.post<OptiyolDispatchOrderResult, any>(
        'core/create-unplanned/orders/',
        { ...dispatchOrder },
        { headers: { ...this.authHeaders } }
      );

    return response;
  }

  @LogMe()
  async sendDispatchVehicle(
    dispatchVehicle: DispatchVehicleDto
  ): Promise<OptiyolDispatchVehicleResult> {
    const {
      data: {
        id,
        vehicleId,
        vehicleProperties,
        driverNameSurname,
        driverPhone,
      },
    } = await this.httpService.axiosRef.post<OptiyolDispatchVehicleResult, any>(
      'v1/vehicles/',
      { ...dispatchVehicle },
      { headers: { ...this.authHeaders } }
    );

    return { id, vehicleId, vehicleProperties, driverNameSurname, driverPhone };
  }
}
