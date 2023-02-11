import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type IntegrationDocument = Integration & Document;

@Schema({ versionKey: false, timestamps: true })
export class Integration {
  _id: string;

  @Prop({
    type: mSchema.Types.String,
  })
  integrator: string;

  @Prop({
    type: mSchema.Types.String,
  })
  integrationType: string;

  @Prop({
    type: mSchema.Types.Boolean,
  })
  priority: boolean;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);
