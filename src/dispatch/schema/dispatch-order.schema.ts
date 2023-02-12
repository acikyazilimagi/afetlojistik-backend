import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';
import { DispatchOrderBody, DispatchOrderBodySchema } from './dispatch-order-body.schema';

export type DispatchOrderDocument = DispatchOrder & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class DispatchOrder {
  @Prop({ type: mSchema.Types.String })
  OrdersPlannedDate: string;

  @Prop({ type: mSchema.Types.String })
  OrdersPlannedTime: string;

  @Prop({ type: [DispatchOrderBodySchema] })
  Orders: DispatchOrderBody[];
}

export const DispatchOrderSchema = SchemaFactory.createForClass(DispatchOrder);
