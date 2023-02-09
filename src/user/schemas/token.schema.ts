import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({ versionKey: false, timestamps: true })
export class Token {
  _id: string;

  @Prop({
    type: mSchema.Types.ObjectId,
    required: true,
  })
  userId: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
  })
  token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
