import { Language } from 'package/database/mongodb/schema/language.schema';
import { GetByCriteria } from 'package/pagination/dto';
import {
  TaskTemplateField,
  TaskTemplateInfo,
} from 'src/university/task/data/task-template.schema';

export enum TaskType {
  clinical = 'clinical',
  laboratory = 'laboratory',
}

export enum FieldType {
  checkBox = 'checkBox',
  textField = 'textField',
}

export class TaskDto {
  quantity: number;
  name: Language;
  taskInfos: TaskTemplateInfo[];
  studentFields: TaskTemplateField[];
  teacherFields: TaskTemplateField[];
}

export class SubjectParams {
  subjectId: number;
}

export class CreateCardRequest {
  subjectId: number;
  laboratoryTasks: TaskDto[];
  clinicalTasks: TaskDto[];
}

export class UpdateTask {
  quantity?: number;
  name?: Language;
  taskInfos?: TaskTemplateInfo[];
  studentFields?: TaskTemplateField[];
  teacherFields?: TaskTemplateField[];
}

export class GetAllTasks extends GetByCriteria {}
