import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';
import { DispatchOrder, DispatchOrderSchema } from './dispatch-order.schema';
import {
  DispatchVehicle,
  DispatchVehicleSchema,
} from './dispatch-vehicle.schema';

export type DispatchDocument = Dispatch & Document;

@Schema({ versionKey: false, timestamps: true })
export class Dispatch {
  _id: string;

  @Prop({
    type: mSchema.Types.String,
  })
  integrator: string;

  @Prop({
    type: DispatchOrderSchema,
  })
  order?: DispatchOrder;

  @Prop({
    type: DispatchVehicleSchema,
  })
  vehicle?: DispatchVehicle;

  @Prop({
    type: mSchema.Types.String,
  })
  orderType: string;

  @Prop({
    type: mSchema.Types.Mixed,
  })
  result: unknown;
}

export const DispatchSchema = SchemaFactory.createForClass(Dispatch);
