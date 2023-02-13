export interface OptiyolOrderDispatch {
  OrderId: string;
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
  PlannedDate: string;
}
export class DispatchableOrder implements OptiyolOrderDispatch {
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

export interface OptiyolVehicleDispatch {
  OrderType: string;
  vehicleId: string;
  vehicleProperties: string;
  driverNameSurname: string;
  driverPhone: string;
}

export class DispatchableVehicle implements OptiyolVehicleDispatch {
  OrderType: string;
  vehicleId: string;
  vehicleProperties: string;
  driverNameSurname: string;
  driverPhone: string;
}
