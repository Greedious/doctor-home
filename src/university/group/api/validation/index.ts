import { Injectable } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import * as joi from 'joi';
import {
  CreateGroupRequest,
  DeleteGroupSchedule,
  GetAllGroup,
  UpdateGroupRequest,
} from '../dto/request';
import { pagination } from 'package/pagination/validation';
import {
  CreateGroupScheduleRequest,
  UpdateGroupScheduleRequest,
} from '../dto/response';

@Injectable()
export class GroupValidation {
  create({ body }: { body: CreateGroupRequest }) {
    const createGroupSchema = joi
      .object<CreateGroupRequest>({
        name: validationSchema.language().required(),
        yearId: validationSchema.id().required(),
      })
      .required();
    return new JoiValidationPipe(createGroupSchema).transform(body);
  }

  createSchedule({
    body,
    params,
  }: {
    body: CreateGroupScheduleRequest;
    params: Params;
  }) {
    const create = joi
      .object({
        subjectId: validationSchema.id().required(),
        dayOfWeek: joi.number().min(1).max(7).required(),
        startTime: validationSchema.hour().required(),
        endTime: validationSchema.hour().required(),
      })
      .custom((value, helpers) => {
        const { startTime, endTime } = value;
        if (startTime >= endTime) {
          return helpers.message({
            custom: 'startTime must be before endTime',
          });
        }
        return value;
      });
    this.paramsId({ params });
    return new JoiValidationPipe(create).transform(body);
  }

  updateSchedule({
    body,
    params,
  }: {
    body: UpdateGroupScheduleRequest;
    params: Params;
  }) {
    const update = joi
      .object({
        subjectId: validationSchema.id().required(),
        dayOfWeek: joi.number().min(1).max(7),
        startTime: validationSchema.hour(),
        endTime: validationSchema.hour(),
      })
      .and('startTime', 'endTime')
      .custom((value, helpers) => {
        const { startTime, endTime } = value;
        if (startTime >= endTime) {
          return helpers.message({
            custom: 'startTime must be before endTime',
          });
        }
        return value;
      });
    this.paramsId({ params });
    return new JoiValidationPipe(update).transform(body);
  }

  delete({ params, body }: { params: Params; body: DeleteGroupSchedule }) {
    const remove = joi.object({
      subjectId: validationSchema.id().required(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(remove).transform(body);
  }

  update({ body, params }: { body: UpdateGroupRequest; params: Params }) {
    const updateGroupSchema = joi
      .object<UpdateGroupRequest>({
        id: validationSchema.id(),
        name: validationSchema.language().required(),
        yearId: validationSchema.id().required(),
      })
      .required();

    this.paramsId({ params });
    return new JoiValidationPipe(updateGroupSchema).transform(body);
  }

  getAll({ query }: { query: GetAllGroup }) {
    const getAll = joi.object({
      ...pagination([true]),
      search: joi.string(),
      yearId: validationSchema.id(),
    });
    return new JoiValidationPipe(getAll).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAllGroupValidations({ query }: { query: { subjectId: number } }) {
    const getGroupValidations = joi.object({
      subjectId: validationSchema.id().required(),
    });
    return new JoiValidationPipe(getGroupValidations).transform(query);
  }
}
