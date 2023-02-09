import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ versionKey: false, timestamps: true, _id: false })
export class Vehicle {
  @Prop({
    type: mSchema.Types.String,
  })
  plateNumber: string;

  @Prop({
    type: mSchema.Types.ObjectId,
  })
  driver: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
