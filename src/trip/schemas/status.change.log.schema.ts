import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';
import { TripsStatuses } from '../types/trip.type';

export type StatusChangeLogDocument = StatusChangeLog & Document;

@Schema({ _id: false, versionKey: false, timestamps: true })
export class StatusChangeLog {
  @Prop({
    type: mSchema.Types.ObjectId,
  })
  user: string;

  @Prop({
    type: mSchema.Types.Date,
  })
  occurredAt: Date;

  @Prop({
    type: mSchema.Types.Number,
    enum: TripsStatuses,
  })
  status: TripsStatuses;
}

export const StatusChangeLogSchema =
  SchemaFactory.createForClass(StatusChangeLog);
