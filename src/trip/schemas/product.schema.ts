import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Product {
  @Prop({
    type: mSchema.Types.ObjectId,
  })
  categoryId: string;

  @Prop({
    type: mSchema.Types.Number,
  })
  count: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
