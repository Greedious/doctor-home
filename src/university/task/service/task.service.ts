import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  NotesRepository,
  TaskRepository,
  TaskTemplateRepository,
} from '../data/task.repository';
import { TaskError } from './task-error.service';
import { FieldType, TaskType } from '../api/dto/request';
import mongoose from 'mongoose';
import { TaskInput } from '../data/task.schema';
import { IUser } from 'src/shared/types/user';
import {
  CreateNote,
  UpdateFields,
} from 'src/university/subject/api/dto/request';
import { Params } from 'package/component/params/params';
import { SupervisorLogRepository } from 'src/university/supervisor-log/data/supervisor-logs.repository';
import { Transaction } from 'sequelize';

@Injectable()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private notesRepository: NotesRepository,
    private supervisorLogRepository: SupervisorLogRepository,
    private taskTemplateRepository: TaskTemplateRepository,
    private taskError: TaskError,
  ) {}

  async getTasksTemplates(subjectId: number) {
    const clinicalTasks = await this.taskTemplateRepository.find({
      filter: {
        subjectId,
        type: TaskType.clinical,
      },
    });
    const laboratoryTasks = await this.taskTemplateRepository.find({
      filter: {
        subjectId,
        type: TaskType.laboratory,
      },
    });

    return {
      clinicalTasks,
      laboratoryTasks,
    };
  }

  async checkTaskTemplate(subjectId: number, _id: mongoose.Types.ObjectId) {
    return await this.taskTemplateRepository.findOne({
      filter: {
        _id: new mongoose.Types.ObjectId(_id),
        subjectId,
      },
      error: this.taskError.notFound(),
    });
  }

  async updateFields(
    user: IUser,
    subjectId: number,
    studentId: number,
    body: UpdateFields,
    transaction: Transaction,
  ) {
    const tasks = await this.taskRepository.find({
      filter: {
        studentId,
        subjectId,
      },
    });

    const map = new Map<string, string | boolean>();
    for (const field of body.fields) {
      map.set(field.id.toString(), field.value);
    }
    const cardQueries = [];
    const logQueries = [];
    tasks.map((task) => {
      const completedTasks = Array<boolean>(task.quantity).fill(false);
      if (user.teacher) {
        task.teacherFields = task.teacherFields.map((field) => {
          field.answers = field.answers.map((answer, index) => {
            if (answer.textField || answer.checkBoxField)
              completedTasks[index] = true;
            if (!map.has(answer._id.toString())) return answer;
            const result = map.get(answer._id.toString());

            logQueries.push(
              this.supervisorLogRepository.create({
                doc: {
                  studentId,
                  teacherId: user.teacher,
                  subjectId,
                  index: index + 1,
                  fieldName: field.name,
                  task: task.name,
                  modification: {
                    oldValue:
                      field.type === FieldType.checkBox
                        ? !!answer.checkBoxField
                        : answer.textField,
                    newValue:
                      field.type === FieldType.checkBox
                        ? !!result
                        : result.toString(),
                  },
                },
                options: { transaction },
              }),
            );

            if (field.type === FieldType.checkBox) {
              answer.checkBoxField = !!result;
            }
            if (field.type === FieldType.textField) {
              answer.textField = result.toString();
            }
            completedTasks[index] = true;
            return answer;
          });
          return field;
        });
      }

      if (user.student) {
        task.studentFields = task.studentFields.map((field) => {
          field.answers = field.answers.map((answer, index) => {
            if (answer.textField || answer.checkBoxField)
              completedTasks[index] = true;
            if (!map.has(answer._id.toString())) return answer;
            const result = map.get(answer._id.toString());
            logQueries.push(
              this.supervisorLogRepository.create({
                doc: {
                  studentId: user.student,
                  teacherId: null,
                  subjectId,
                  index: index + 1,
                  fieldName: field.name,
                  task: task.name,
                  modification: {
                    oldValue:
                      field.type === FieldType.checkBox
                        ? !!answer.checkBoxField
                        : answer.textField,
                    newValue:
                      field.type === FieldType.checkBox
                        ? !!result
                        : result.toString(),
                  },
                },
                options: { transaction },
              }),
            );
            if (field.type === FieldType.checkBox) {
              answer.checkBoxField = !!result;
            }
            if (field.type === FieldType.textField) {
              answer.textField = result.toString();
            }
            completedTasks[index] = true;
            return answer;
          });
          return field;
        });
      }

      let remaining = 0;
      completedTasks.map((value) => {
        remaining += Number(value);
        return remaining;
      });

      task.remaining = remaining;

      cardQueries.push(
        this.taskRepository.findOneAndUpdate({
          filter: { _id: task._id },
          update: task,
          error: this.taskError.notFound(),
        }),
      );
    });

    await Promise.all(cardQueries);
    await Promise.all(logQueries);
    return;
  }

  async findNotes(subjectId: number, studentId: number) {
    return await this.notesRepository.find({
      filter: {
        studentId,
        subjectId,
      },
    });
  }

  async findOrCreate(subjectId: number, studentId: number) {
    let clinicalCard = await this.taskRepository.find({
      filter: {
        type: TaskType.clinical,
        subjectId,
        studentId,
      },
    });
    let laboratoryCard = await this.taskRepository.find({
      filter: {
        type: TaskType.laboratory,
        subjectId,
        studentId,
      },
    });

    if (clinicalCard.length && laboratoryCard.length) {
      return {
        clinicalCard,
        laboratoryCard,
      };
    }

    const taskTemplate = await this.taskTemplateRepository.find({
      filter: {
        subjectId,
      },
    });

    if (!taskTemplate.length) {
      throw new HttpException(this.taskError.notFound(), HttpStatus.NOT_FOUND);
    }

    await this.taskRepository.insertMany({
      docs: taskTemplate.map((taskTemplate) => {
        const taskId = taskTemplate._id;
        delete taskTemplate._id;
        return {
          subjectId,
          studentId,
          ...taskTemplate,
          parentTask: taskId,
          remaining: taskTemplate.quantity,
          studentFields: taskTemplate.studentFields.map((studentField) => {
            return {
              name: studentField.name,
              type: studentField.type,
              answers: new Array(taskTemplate.quantity).fill({
                textField: '',
                checkBoxField: false,
              } as TaskInput),
            };
          }),
          teacherFields: taskTemplate.teacherFields.map((teacherField) => {
            return {
              name: teacherField.name,
              type: teacherField.type,
              answers: new Array(taskTemplate.quantity).fill({
                textField: '',
                checkBoxField: false,
              } as TaskInput),
            };
          }),
        };
      }),
    });

    clinicalCard = await this.taskRepository.find({
      filter: {
        studentId,
        subjectId,
        type: TaskType.clinical,
      },
    });
    laboratoryCard = await this.taskRepository.find({
      filter: {
        studentId,
        subjectId,
        type: TaskType.laboratory,
      },
    });

    return {
      laboratoryCard,
      clinicalCard,
    };
  }

  async createNote(
    user: IUser,
    { id }: Params,
    body: CreateNote,
    studentId: number,
  ) {
    const notes = await this.notesRepository.create({
      doc: {
        teacherNotes: user.teacher ? body.message : undefined,
        studentNotes: user.student ? body.message : undefined,
        subjectId: +id,
        studentId,
      },
    });
    return notes;
  }

  async getUniqueSubjectIds() {
    return await this.taskRepository.distinct({ field: 'subjectId' });
  }
}
