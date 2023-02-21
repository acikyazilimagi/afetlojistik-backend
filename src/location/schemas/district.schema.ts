import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type DistrictDocument = District & Document;

@Schema({ versionKey: false, timestamps: true })
export class District {
  _id: string;

  @Prop({
    type: mSchema.Types.String,
  })
  name: string;

  @Prop({
    type: mSchema.Types.ObjectId,
  })
  cityId: string;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
