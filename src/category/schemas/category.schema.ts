import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false, timestamps: true })
export class Category {
  _id: string;

  @Prop({
    type: mSchema.Types.ObjectId,
    required: true,
  })
  organizationId: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
  })
  name: string;

  @Prop({
    type: mSchema.Types.Array,
    required: false,
  })
  subCategories: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
