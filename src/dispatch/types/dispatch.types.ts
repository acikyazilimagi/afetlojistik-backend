export interface OptiyolDispach {
  OrderId: string;
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
  PlannedDate: string;
}

export class IDispatchable implements OptiyolDispach {
  OrderId: string;
  OrderType: string;
  FromLocationName?: string;
  FromLocationAddress?: string;
  FromLocationCounty: string;
  FromLocationCity: string;
  ToLocationName?: string;
  ToLocationAddress: string;
  ToLocationCounty: string;
  ToLocationCity: string;
  Note: string;
  RequiredVehicleProperties: string;
  PlannedDate: string;
}