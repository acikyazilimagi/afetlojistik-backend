import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';
import { TripsStatuses } from '../types/trip.type';
import { LocationSchema, Location } from './location.schema';
import { Product, ProductSchema } from './product.schema';
import {
  StatusChangeLog,
  StatusChangeLogSchema,
} from './status.change.log.schema';
import { Vehicle, VehicleSchema } from './vehicle.schema';

export type TripDocument = Trip & Document;
@Schema({ versionKey: false, timestamps: true })
export class Trip {
  _id: string;

  @Prop({
    type: mSchema.Types.Number,
  })
  tripNumber: number;

  @Prop({
    type: mSchema.Types.ObjectId,
    required: true,
  })
  organizationId: string;

  @Prop({
    type: mSchema.Types.Number,
    enum: TripsStatuses,
  })
  status: string;

  @Prop({
    type: VehicleSchema,
    required: true,
  })
  vehicle?: Vehicle;

  @Prop({
    type: LocationSchema,
    required: true,
  })
  fromLocation?: Location;

  @Prop({
    type: LocationSchema,
    required: true,
  })
  toLocation?: Location;

  @Prop({
    type: mSchema.Types.ObjectId,
    required: true,
  })
  createdBy: string;

  @Prop({
    type: [StatusChangeLogSchema],
    required: true,
  })
  statusChangeLog: StatusChangeLog[];

  @Prop({
    type: mSchema.Types.Date,
  })
  estimatedDepartTime: Date;

  @Prop({
    type: mSchema.Types.String,
    required: false,
  })
  notes?: String;

  @Prop({
    type: [ProductSchema],
  })
  products: Product[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
