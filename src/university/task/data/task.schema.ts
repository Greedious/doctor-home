import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Language,
  LanguageSchema,
} from 'package/database/mongodb/schema/language.schema';
import { FieldType, TaskType } from '../api/dto/request';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: false, _id: true })
export class TaskInput {
  @Prop({ type: String, required: false, default: '' })
  textField: string;

  @Prop({ type: Boolean, required: false, default: false })
  checkBoxField: boolean;
}

export type TaskInputDocument = TaskInput & Document;

const TaskInputSchema = SchemaFactory.createForClass(TaskInput);

@Schema({ timestamps: false, _id: false })
export class TaskField {
  @Prop({ type: String, enum: FieldType, required: true })
  type: FieldType;

  @Prop({ type: LanguageSchema, required: true })
  name: Language;

  @Prop({ type: [TaskInputSchema], required: false, default: [] })
  answers: TaskInputDocument[];
}

export const TaskFieldSchema = SchemaFactory.createForClass(TaskField);

@Schema({ timestamps: false, _id: false })
export class TaskInfo {
  @Prop({ type: LanguageSchema, required: true })
  key: Language;

  @Prop({ type: [LanguageSchema], required: true })
  values: Language[];
}

export const TaskInfoSchema = SchemaFactory.createForClass(TaskInfo);

@Schema({
  timestamps: true,
  _id: true,
})
export class Task {
  @Prop({ type: mongoose.Types.ObjectId, required: true })
  parentTask: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true })
  subjectId: number;

  @Prop({ type: Number, required: true })
  studentId: number;

  @Prop({ type: LanguageSchema, required: true })
  name: Language;

  @Prop({ type: String, required: true, enum: TaskType })
  type: TaskType;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  remaining: number;

  @Prop({ type: [TaskInfoSchema], required: true })
  taskInfos: TaskInfo[];

  @Prop({ type: [TaskFieldSchema], required: true, default: [] })
  studentFields: TaskField[];

  @Prop({ type: [TaskFieldSchema], required: true, default: [] })
  teacherFields: TaskField[];
}

export type TaskDocument = Task & Document;

export const TaskSchema = SchemaFactory.createForClass(Task);

@Schema({ timestamps: true })
export class Notes {
  @Prop({ type: Number, required: true })
  studentId: number;

  @Prop({ type: Number, required: true })
  subjectId: number;

  @Prop({ type: String, required: false })
  studentNotes: string;

  @Prop({ type: String, required: false })
  teacherNotes: string;
}

export type NotesDocument = Notes & Document;

export const NotesSchema = SchemaFactory.createForClass(Notes);
//todo update this if shit goes serious
@Schema({ timestamps: false })
export class Card {
  @Prop({ type: [NotesSchema], required: true, default: [] })
  notes: Notes[];

  @Prop({ type: [TaskSchema], required: true, default: [] })
  tasks: Task[];
}
