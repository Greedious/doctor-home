import { assert } from 'console';
import { FieldType } from 'src/university/task/api/dto/request';
import { TaskDocument } from 'src/university/task/data/task.schema';

export class TaskResponse {
  taskInfos: {
    key: string;
    value: string;
  }[];

  studentFields: {
    id: string;
    name: string;
    type: FieldType;
    value: string | boolean;
  }[];

  teacherFields: {
    id: string;
    name: string;
    type: FieldType;
    value: string | boolean;
  }[];
}

export class GetSubjectCard {
  id: string;
  name: string;
  task: TaskResponse[];
  constructor({
    task,
    languageKey,
  }: {
    task: TaskDocument;
    languageKey: string;
  }) {
    this.id = task._id;
    this.name = task.name[languageKey];
    const taskResponse: TaskResponse[] = [];
    for (let i = 0; i < task.quantity; i++) {
      const taskInfos = task.taskInfos.map((taskInfo) => {
        assert(taskInfo.values.length === task.quantity);
        return {
          key: taskInfo.key[languageKey],
          value: taskInfo.values[i][languageKey],
        };
      });

      const studentFields = task.studentFields.map((studentField) => {
        assert(studentField.answers?.length === task.quantity);

        return {
          id: studentField.answers[i]._id,
          name: studentField.name[languageKey],
          type: studentField.type,
          value:
            studentField.type === FieldType.checkBox
              ? studentField.answers[i].checkBoxField || false
              : studentField.answers[i].textField || '',
        };
      });
      const teacherFields = task.teacherFields.map((teacherField) => {
        assert(teacherField.answers?.length === task.quantity);

        return {
          id: teacherField.answers[i]._id,
          name: teacherField.name[languageKey],
          type: teacherField.type,
          value:
            teacherField.type === FieldType.checkBox
              ? teacherField.answers[i].checkBoxField || false
              : teacherField.answers[i].textField || '',
        };
      });
      taskResponse.push({
        taskInfos,
        studentFields,
        teacherFields,
      });
    }
    this.task = taskResponse;
  }

  toObject(): { id: string; name: string; task: TaskResponse[] } {
    return {
      id: this.id,
      name: this.name,
      task: this.task,
    };
  }
}
