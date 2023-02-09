import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type DriverDocument = Driver & Document;

@Schema({ versionKey: false, timestamps: true })
export class Driver {
  _id: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
    minlength: 6,
    maxlength: 20,
  })
  name: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
  })
  phone: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
  })
  plateNumber: string;

  @Prop({
    type: mSchema.Types.ObjectId,
    required: true,
  })
  organizationId: string;

  @Prop({
    type: mSchema.Types.Boolean,
    default: false,
  })
  kvkkApproval: boolean;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
