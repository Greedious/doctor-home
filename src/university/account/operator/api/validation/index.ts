import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import {
  CreateUniversityOperatorRequest,
  UpdateUniversityOperator,
} from '../dto/request';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { validationSchema } from 'package/validation';
import { GetByCriteria } from 'package/pagination/dto';
import { pagination } from 'package/pagination/validation';
import { Params } from 'package/component/params/params';
@Injectable()
export class UniversityOperatorValidation {
  create({ body }: { body: CreateUniversityOperatorRequest }) {
    const create = joi.object<CreateUniversityOperatorRequest>({
      fullName: joi.string().min(4).required(),
      username: joi.string().min(3).required(),
      password: joi.string().min(8).required(),
      role: validationSchema.id().required(),
    });
    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateUniversityOperator; params: Params }) {
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
