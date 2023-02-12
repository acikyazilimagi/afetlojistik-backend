export type OptiyolDispatchOrderResult = {
  info: string;
  created_order_count: number;
  succes: boolean;
}

export type OptiyolDispatchVehicleResult = {
  id: number;
  vehicleId: string;
  vehicleProperties: string;
  driverNameSurname: string;
  driverPhone: string;
}