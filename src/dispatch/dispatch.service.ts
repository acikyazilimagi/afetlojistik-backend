import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from 'src/common/decorators/log.decorator';
import { IntegrationService } from 'src/integration/integration.service';
import { IntegrationDocument } from 'src/integration/schemas/integration.schema';
import { Integrators } from 'src/integration/types/integration.types';
import { DispatchDto, DispatchOrderDto, DispatchResultDto } from './dtos/dispatch.dto';
import { DispatchFormatter } from './formatters/dispatch.formatter';
import { Dispatch } from './schema/dispatch.schema';
import { IDispatchable } from './types/dispatch.types';

/*
  {
    "_id":"63e793f8f6420eece57abf5f",
    "organizationId":"63e5eb8e3dd17d3197807a62",
    "status":100,
    "vehicle":{"plate":{"truck":"53RZE535","trailer":"53RZE536"},"name":"Beyza B","phone":"5392301653"},
    "fromLocation":{"cityId":"5907ace2192af335e137e768","districtId":"5907acfd79e1f736021281be","cityName":"Rize","districtName":"Çayeli"},
    "toLocation":{"cityId":"5907ace2192af335e137e770","districtId":"5907acfd79e1f73602128221","address":"Akçaabat","cityName":"Trabzon","districtName":"Akçaabat"},
    "createdBy":{"_id":"63e67f013dd17d3197807aaf","active":true,"name":"Beyza","surname":"Barut","phone":"5392306153"},
    "statusChangeLog":[{"createdBy":{"_id":"63e67f013dd17d3197807aaf","active":true,"name":"Beyza","surname":"Barut","phone":"5392306153"},
    "status":100,
    "createdAt":"2023-02-11T13:11:20.353Z"}],
    "estimatedDepartTime":"2023-02-10T12:00:00.000Z",
    "notes":"Please contact with ... person on arrival",
    "products":[
      {
        "categoryId":"63e529355de2a75a7917c735",
        "count":5,
        "categoryName":"KURU GIDA"
      },
      {
        "categoryId":"63e529355de2a75a7917c73c",
        "count":50,
        "categoryName":"BEBEK GİYİM"
      }
    ],
    "createdAt":"2023-02-11T13:11:20.356Z",
    "updatedAt":"2023-02-11T13:11:20.356Z",
    "tripNumber":61
  }
*/

@Injectable()
export class DispatchService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Dispatch.name)
    private readonly dispatchModel: Model<Dispatch>,
    private readonly integrationService: IntegrationService,
  ){}

  @LogMe()
  async dispatch(data: IDispatchable): Promise<void> {
    const integration: IntegrationDocument = await this.integrationService.getPriorIntegration();
    const dispatchOrder: DispatchOrderDto = DispatchFormatter.formatDispatch(integration, data);

    if (!dispatchOrder) {
      // throw new InvalidDispatchException({ data });
    }

    const dispatch: DispatchDto = {
      integrator: integration.integrator,
      order: dispatchOrder,
      orderType: data.OrderType,
      result: { result: true },
    };

    await this.dispatchModel.create(dispatch);
  }
}