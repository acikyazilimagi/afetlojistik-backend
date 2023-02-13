import {
  OptiyolDispatchOrderResult,
  OptiyolDispatchVehicleResult,
} from '../types/optiyol.types';

export class DispatchOrderDto {
  OrdersPlannedDate: string;
  OrdersPlannedTime: string;
  Orders: {
    FromLocationName?: string;
    FromLocationAddress?: string | undefined;
    FromLocationCounty: string;
    FromLocationCity: string;
    ToLocationName?: string;
    ToLocationAddress: string;
    ToLocationCounty: string;
    ToLocationCity: string;
    Note: string;
    RequiredVehicleProperties: string;
  }[];
}

export class DispatchVehicleDto {
  vehicleId: string;
  vehicleProperties: string;
  driverNameSurname: string;
  driverPhone: string;
}

export class DispatchResultDto {
  result: OptiyolDispatchOrderResult | OptiyolDispatchVehicleResult | unknown;
}
export class DispatchDto {
  integrator: string;
  order?: DispatchOrderDto;
  vehicle?: DispatchVehicleDto;
  orderType: string;
  result: DispatchResultDto;
}
