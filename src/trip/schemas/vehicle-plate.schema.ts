import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type VehicleDocument = VehiclePlate & Document;

@Schema({ versionKey: false, timestamps: false, _id: false })
export class VehiclePlate {
  @Prop({
    type: mSchema.Types.String,
  })
  truck: string;

  @Prop({
    type: mSchema.Types.String,
  })
  trailer?: string;
}

export const VehiclePlateSchema = SchemaFactory.createForClass(VehiclePlate);
