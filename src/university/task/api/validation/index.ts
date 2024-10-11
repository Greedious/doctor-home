import { Injectable } from '@nestjs/common';
import {
  CreateCardRequest,
  FieldType,
  SubjectParams,
  TaskDto,
  UpdateTask,
} from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { MongooseParams } from 'package/component/params/params';
import { GetByCriteria } from 'package/pagination/dto';
import {
  TaskTemplateField,
  TaskTemplateInfo,
} from '../../data/task-template.schema';

@Injectable()
export class TaskValidation {
  create({ body }: { body: CreateCardRequest }) {
    const create = joi
      .object<CreateCardRequest>({
        subjectId: validationSchema.id().required(),
        laboratoryTasks: joi.array().min(0).items(this.taskDto()).required(),
        clinicalTasks: joi.array().min(0).items(this.taskDto()).required(),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateTask; params: MongooseParams }) {
    const update = joi
      .object<TaskDto>({
        name: validationSchema.language(),
        quantity: joi.number().integer().min(1),
        taskInfos: joi
          .array()
          .min(1)
          .items(
            joi.object<TaskTemplateInfo>({
              key: validationSchema.language().required(),
              values: joi
                .array()
                .items(validationSchema.language().required())
                .min(joi.ref('....quantity'))
                .max(joi.ref('....quantity'))
                .required(),
            }),
          ),
        studentFields: joi.array().items(
          joi.object<TaskTemplateField>({
            name: validationSchema.language().required(),
            type: joi
              .string()
              .valid(...Object.values(FieldType))
              .required(),
          }),
        ),
        teacherFields: joi.array().items(
          joi.object<TaskTemplateField>({
            name: validationSchema.language().required(),
            type: joi
              .string()
              .valid(...Object.values(FieldType))
              .required(),
          }),
        ),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(update).transform(body);
  }

  paramsId({ params }: { params: MongooseParams }) {
    const paramsId = joi.object({ id: validationSchema.mongoId().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  subjectParamsId({ params }: { params: SubjectParams }) {
    const paramsId = joi.object({
      subjectId: validationSchema.id().required(),
    });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAll({ query }: { query: GetByCriteria }) {
    const getAll = joi.object({});
    return new JoiValidationPipe(getAll).transform(query);
  }

  taskDto() {
    return joi
      .object<TaskDto>({
        name: validationSchema.language().required(),
        quantity: joi.number().integer().min(1).required(),
        taskInfos: joi
          .array()
          .min(0)
          .items(
            joi.object<TaskTemplateInfo>({
              key: validationSchema.language().required(),
              values: joi
                .array()
                .items(validationSchema.language().required())
                .min(joi.ref('....quantity'))
                .max(joi.ref('....quantity'))
                .required(),
            }),
          )
          .required(),
        studentFields: joi
          .array()
          .items(
            joi.object<TaskTemplateField>({
              name: validationSchema.language().required(),
              type: joi
                .string()
                .valid(...Object.values(FieldType))
                .required(),
            }),
          )
          .min(0)
          .required(),
        teacherFields: joi
          .array()
          .items(
            joi.object<TaskTemplateField>({
              name: validationSchema.language().required(),
              type: joi
                .string()
                .valid(...Object.values(FieldType))
                .required(),
            }),
          )
          .min(0)
          .required(),
      })
      .custom((value, helpers) => {
        const studentFieldsLength = value.studentFields.length;
        const teacherFieldsLength = value.teacherFields.length;
        if (studentFieldsLength + teacherFieldsLength <= 1) {
          return helpers.message({
            custom:
              'The combined length of studentFields and teacherFields must be greater than 1',
          });
        }
        return value;
      });
  }
}
