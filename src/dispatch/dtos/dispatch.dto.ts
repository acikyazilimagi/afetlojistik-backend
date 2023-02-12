import { OptiyolDispatchOrderResult } from "../types/optiyol.types";

export class DispatchOrderDto {
  OrdersPlannedDate: string;
  OrdersPlannedTime: string;
  Orders: {
    FromLocationName?: string;
    FromLocationAddress?: (string | undefined);
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

export class DispatchResultDto {
  result: (OptiyolDispatchOrderResult | unknown);
}
export class DispatchDto {
  integrator: string;
  order: DispatchOrderDto;
  orderType: string;
  result: DispatchResultDto;
}