import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  _id: string;

  @Prop({
    type: mSchema.Types.Boolean,
    default: true,
  })
  active?: boolean;

  @Prop({
    type: mSchema.Types.String,
    required: true,
    minlength: 3,
    maxlength: 20,
  })
  name: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
    minlength: 3,
    maxlength: 20,
  })
  surname: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
    minlength: 5,
    maxlength: 50,
  })
  password: string;

  @Prop({
    type: mSchema.Types.String,
    required: false,
    minlength: 5,
    maxlength: 50,
  })
  email?: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
    minlength: 5,
    maxlength: 50,
  })
  phone: string;

  @Prop({
    type: mSchema.Types.Array,
    required: false,
    default: [],
  })
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
