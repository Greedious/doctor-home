import { language } from 'package/utils/language/language';
import { SupervisorLog } from 'src/university/supervisor-log/data/supervisor-logs.schema';
import { Modification } from '../request';

export class GetSupervisorLogsResponse {
  id: number;
  task: string;
  fieldName: string;
  teacher: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    name: string;
  };
  index: number;
  modification: Modification;

  constructor({
    log,
    languageKey,
  }: {
    log: SupervisorLog;
    languageKey: string;
  }) {
    this.id = log.id;
    this.task = log.task[languageKey];
    this.fieldName = log.fieldName[languageKey];
    this.index = log.index;
    this.student = {
      id: log.student.id,
      name: log.student.firstName + ' ' + log.student.lastName,
    };
    this.teacher = log.teacher
      ? {
          id: log.teacher.id,
          name: log.teacher.firstName + ' ' + log.teacher.lastName,
        }
      : null;

    this.modification = log.modification;
  }

  toObject(): {
    id: number;
    task: string;
    fieldName: string;
    teacher: {
      id: number;
      name: string;
    };
    student: {
      id: number;
      name: string;
    };
    index: number;
    modification: Modification;
  } {
    const response = {
      id: this.id,
      task: this.task,
      fieldName: this.fieldName,
      index: this.index,
      modification: this.modification,
      teacher: this.teacher,
      student: this.student,
    };
    return response;
  }
}
