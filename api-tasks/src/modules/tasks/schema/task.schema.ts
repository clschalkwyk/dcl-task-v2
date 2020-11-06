import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({timestamps: true})
export class Task {
  _id?: string;

  @Prop({required: true})
  title: string;

  @Prop()
  owner: string;

  @Prop()
  status: number;

  @Prop()
  createdAt: { type: Date }

  @Prop()
  updatedAt: { type: Date }
}

export const TaskSchema = SchemaFactory.createForClass(Task);
