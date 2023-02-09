import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type CityDocument = City & Document;

@Schema({ versionKey: false, timestamps: true })
export class City {
  _id: string;

  @Prop({
    type: mSchema.Types.String,
  })
  name: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
