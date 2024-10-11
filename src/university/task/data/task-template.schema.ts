import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Language,
  LanguageSchema,
} from 'package/database/mongodb/schema/language.schema';
import { FieldType, TaskType } from '../api/dto/request';
import { Document } from 'mongoose';

@Schema({ timestamps: false, _id: false })
export class TaskTemplateField {
  @Prop({ type: String, enum: FieldType, required: true })
  type: FieldType;

  @Prop({ type: LanguageSchema, required: true })
  name: Language;
}

export const TaskTemplateFieldSchema =
  SchemaFactory.createForClass(TaskTemplateField);

@Schema({ timestamps: false, _id: false })
export class TaskTemplateInfo {
  @Prop({ type: LanguageSchema, required: true })
  key: Language;

  @Prop({ type: [LanguageSchema], required: true })
  values: Language[];
}

export const TaskTemplateInfoSchema =
  SchemaFactory.createForClass(TaskTemplateInfo);

@Schema({
  timestamps: true,
})
export class TaskTemplate {
  @Prop({ type: Number, required: true })
  subjectId: number;

  @Prop({ type: Number, required: true })
  rank: number;

  @Prop({ type: LanguageSchema, required: true })
  name: Language;

  @Prop({ type: String, required: true, enum: TaskType })
  type: TaskType;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: [TaskTemplateInfoSchema], required: true })
  taskInfos: TaskTemplateInfo[];

  @Prop({ type: [TaskTemplateFieldSchema], required: true, default: [] })
  studentFields: TaskTemplateField[];

  @Prop({ type: [TaskTemplateFieldSchema], required: true, default: [] })
  teacherFields: TaskTemplateField[];
}

export type TaskTemplateDocument = TaskTemplate & Document;

export const TaskTemplateSchema = SchemaFactory.createForClass(TaskTemplate);
