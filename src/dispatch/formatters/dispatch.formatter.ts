import { DispatchOrderDto, DispatchVehicleDto } from '../dtos/dispatch.dto';
import {
  DispatchableOrder,
  DispatchableVehicle,
} from '../types/dispatch.types';

export class DispatchFormatter {
  static formatDispatchOrder(data: DispatchableOrder): DispatchOrderDto {
    const plannedDate = new Date(data.PlannedDate)
      .toLocaleDateString('tr')
      .split('T')[0]
      .replace('/', '.');
    const plannedTime = new Date(data.PlannedDate).toLocaleTimeString('tr');
    const order: DispatchableOrder = data;
    delete order['PlannedDate'];

    return {
      OrdersPlannedDate: plannedDate,
      OrdersPlannedTime: plannedTime,
      Orders: [
        {
          ...order,
        },
      ],
    } as DispatchOrderDto;
  }

  static formatDispatchVehicle(data: DispatchableVehicle): DispatchVehicleDto {
    return {
      vehicleId: data.vehicleId,
      vehicleProperties: data.vehicleProperties,
      driverNameSurname: data.driverNameSurname,
      driverPhone: data.driverPhone,
    };
  }
}
