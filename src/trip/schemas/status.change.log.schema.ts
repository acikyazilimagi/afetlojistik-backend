import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';
import { TripsStatuses } from '../types';

export type StatusChangeLogDocument = StatusChangeLog & Document;

@Schema({
  _id: false,
  versionKey: false,
  timestamps: { createdAt: false, updatedAt: false },
})
export class StatusChangeLog {
  @Prop({
    type: mSchema.Types.ObjectId,
  })
  createdBy: string;

  @Prop({
    type: mSchema.Types.Number,
    enum: TripsStatuses,
  })
  status: TripsStatuses;

  @Prop({
    type: mSchema.Types.Date,
    default: new Date(),
  })
  createdAt: Date;
}

export const StatusChangeLogSchema =
  SchemaFactory.createForClass(StatusChangeLog);
