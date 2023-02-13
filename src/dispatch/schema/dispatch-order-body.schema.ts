import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type DispatchOrderDocument = DispatchOrderBody & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class DispatchOrderBody {
  @Prop({ type: mSchema.Types.String })
  OrderId: string;

  @Prop({ type: mSchema.Types.String, required: false })
  FromLocationName?: string;

  @Prop({ type: mSchema.Types.String, required: false })
  FromLocationAddress?: string | undefined;

  @Prop({ type: mSchema.Types.String })
  FromLocationCounty: string;

  @Prop({ type: mSchema.Types.String })
  FromLocationCity: string;

  @Prop({ type: mSchema.Types.String, required: false })
  ToLocationName?: string;

  @Prop({ type: mSchema.Types.String })
  ToLocationAddress: string;

  @Prop({ type: mSchema.Types.String })
  ToLocationCounty: string;

  @Prop({ type: mSchema.Types.String })
  ToLocationCity: string;

  @Prop({ type: mSchema.Types.String })
  Note: string;

  @Prop({ type: mSchema.Types.String })
  RequiredVehicleProperties: string;
}

export const DispatchOrderBodySchema =
  SchemaFactory.createForClass(DispatchOrderBody);
