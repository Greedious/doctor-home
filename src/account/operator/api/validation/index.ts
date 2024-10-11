import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { CreateOperatorRequest, UpdateOperator } from '../dto/request';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { validationSchema } from 'package/validation';
import { GetByCriteria } from 'package/pagination/dto';
import { pagination } from 'package/pagination/validation';
import { Params } from 'package/component/params/params';
@Injectable()
export class OperatorValidation {
  create({ body }: { body: CreateOperatorRequest }) {
    const create = joi.object<CreateOperatorRequest>({
      fullName: joi.string().required().min(4),
      username: joi.string().required().min(3),
      password: joi.string().min(8).required(),
      role: validationSchema.id().required(),
    });

    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateOperator; params: Params }) {
    const update = joi.object({
      isActive: joi.boolean(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(update).transform(body);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAll({ query }: { query: GetByCriteria }) {
    const getAll = joi.object({
      ...pagination([true]),
      isActive: joi.boolean(),
      fullName: joi.string(),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
}
