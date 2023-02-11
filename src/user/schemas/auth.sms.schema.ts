import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type AuthSMSDocument = AuthSMS & Document;

@Schema({ versionKey: false, timestamps: true, expires: 300 })
export class AuthSMS {
  _id: string;

  @Prop({
    type: mSchema.Types.String,
    required: true,
  })
  phone: string;

  @Prop({
    type: mSchema.Types.Number,
  })
  verificationCode: number;

  @Prop({
    type: mSchema.Types.String,
    required: true,
  })
  message: string;

  @Prop({
    type: mSchema.Types.Number,
    default: 0,
  })
  smsCount: number;
}

export const AuthSMSSchema = SchemaFactory.createForClass(AuthSMS);
