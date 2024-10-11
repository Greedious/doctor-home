import { Injectable } from '@nestjs/common';
import { CreateQuestionRequest, UpdateQuestion } from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { GetByCriteria } from 'package/pagination/dto';

@Injectable()
export class QuestionValidation {
  create({ body }: { body: CreateQuestionRequest }) {
    const create = joi
      .object({
        question: validationSchema.language().required(),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateQuestion; params: Params }) {
    const update = joi
      .object<UpdateQuestion>({
        id: validationSchema.id(),
        question: validationSchema.language().optional(),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(update).transform(body);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAll({ query }: { query: GetByCriteria }) {
    const getAll = joi.object({});
    return new JoiValidationPipe(getAll).transform(query);
  }
}
