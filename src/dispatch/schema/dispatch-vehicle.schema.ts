import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type DispatchVehicleDocument = DispatchVehicle & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class DispatchVehicle {
  @Prop({ type: mSchema.Types.Number })
  id: number;

  @Prop({ type: mSchema.Types.String })
  vehicleId: string;

  @Prop({ type: mSchema.Types.String })
  vehicleProperties: string;

  @Prop({ type: mSchema.Types.String })
  driverNameSurname: string;

  @Prop({ type: mSchema.Types.String })
  driverPhone: string;
}

export const DispatchVehicleSchema = SchemaFactory.createForClass(DispatchVehicle);
