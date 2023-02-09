import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ versionKey: false, timestamps: true })
export class Organization {
  _id: string;

  @Prop({
    type: mSchema.Types.String,
  })
  name: string;

  @Prop({
    type: mSchema.Types.String,
  })
  description: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
