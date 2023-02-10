import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';
import { VehiclePlate } from './vehicle-plate.schema';

export type VehicleDocument = Vehicle & Document;

@Schema({ versionKey: false, timestamps: false, _id: false })
export class Vehicle {
  @Prop({
    type: mSchema.Types.Array,
  })
  plate: VehiclePlate[];

  @Prop({
    type: mSchema.Types.String,
  })
  name: string;

  @Prop({
    type: mSchema.Types.String,
  })
  phone: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
