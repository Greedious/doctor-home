import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import {
  CreateSupervisorLogRequest,
  GetSupervisorLogsQuery,
  UpdateSupervisorLogRequest,
} from '../dto/request';
import { pagination } from 'package/pagination/validation';

@Injectable()
export class SupervisorLogValidation {
  create({ body }: { body: CreateSupervisorLogRequest }) {
    const createSupervisorLogSchema = joi
      .object<CreateSupervisorLogRequest>({
        name: validationSchema.language().required(),
      })
      .required();
    return new JoiValidationPipe(createSupervisorLogSchema).transform(body);
  }

  update({
    body,
    params,
  }: {
    body: UpdateSupervisorLogRequest;
    params: Params;
  }) {
    const updateSupervisorLogSchema = joi
      .object<UpdateSupervisorLogRequest>({
        id: validationSchema.id(),
        name: validationSchema.language(),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(updateSupervisorLogSchema).transform(body);
  }

  get({ query }: { query: GetSupervisorLogsQuery }) {
    const getSupervisorLogsQuerySchema = joi.object<GetSupervisorLogsQuery>({
      ...pagination([true]),
      studentId: validationSchema.id(),
    });
    return new JoiValidationPipe(getSupervisorLogsQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
