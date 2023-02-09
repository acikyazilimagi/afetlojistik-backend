import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';
import { TripsStatuses } from '../types/trip.type';
import { Vehicle, VehicleSchema } from './vehicle.schema';

export type TripDocument = Trip & Document;

@Schema({ versionKey: false, timestamps: true })
export class Trip {
  _id: string;

  @Prop({
    type: mSchema.Types.Number,
    enum: TripsStatuses,
  })
  status: string;

  @Prop({
    type: mSchema.Types.ObjectId,
  })
  organization: string;

  @Prop({
    type: VehicleSchema,
    required: true,
  })
  vehicle?: Vehicle;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
