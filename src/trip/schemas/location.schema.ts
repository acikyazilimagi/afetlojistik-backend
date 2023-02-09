import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ versionKey: false, timestamps: true, _id: false })
export class Location {
  @Prop({
    type: mSchema.Types.ObjectId,
  })
  city: string;

  @Prop({
    type: mSchema.Types.ObjectId,
  })
  district: string;

  @Prop({
    type: mSchema.Types.String,
  })
  address: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
