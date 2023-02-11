import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mSchema } from 'mongoose';

export type DispatchOrderDocument = DispatchOrder & Document;

@Schema({ _id: false, versionKey: false, timestamps: false })
export class DispatchOrder {
}

export const DispatchOrderSchema = SchemaFactory.createForClass(DispatchOrder);
