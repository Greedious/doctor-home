import { Subject } from 'src/university/subject/data/subject.schema';
import { TaskTemplateDocument } from 'src/university/task/data/task-template.schema';

export class GetBySubjectTaskResponse {
  id: number;
  name: string;
  taskInfoFieldsCount: number;
  teacherFieldsCount: number;
  studentFieldsCount: number;

  constructor({
    task,
    languageKey,
  }: {
    task: TaskTemplateDocument;
    languageKey: string;
  }) {
    this.id = task._id;
    this.name = task.name[languageKey];
    this.teacherFieldsCount = task.teacherFields.length;
    this.studentFieldsCount = task.studentFields.length;
  }

  toObject(): {
    id: number;
    name: string;
    taskInfoFieldsCount: number;
    teacherFieldsCount: number;
    studentFieldsCount: number;
  } {
    return {
      id: this.id,
      name: this.name,
      taskInfoFieldsCount: this.taskInfoFieldsCount,
      teacherFieldsCount: this.teacherFieldsCount,
      studentFieldsCount: this.studentFieldsCount,
    };
  }
}
