import { IntegrationDocument } from "src/integration/schemas/integration.schema";
import { DispatchOrderDto } from "../dtos/dispatch.dto";
import { IDispatchable } from "../types/dispatch.types";

export class DispatchFormatter {
  static formatDispatch(integration: IntegrationDocument, data: IDispatchable): DispatchOrderDto {
    const plannedDate = new Date(data.PlannedDate).toLocaleDateString('tr').split('T')[0].replace('/','.');
    const plannedTime = new Date(data.PlannedDate).toLocaleTimeString('tr');
    const order: IDispatchable = data;
    delete order['PlannedDate'];

    return {
      OrdersPlannedDate: plannedDate,
      OrdersPlannedTime: plannedTime,
      Orders: [{
        ...order,
      }],
    } as DispatchOrderDto;
  }
}