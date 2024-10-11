import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import {
  CreateYearRequest,
  GetYearsQuery,
  UpdateYearRequest,
} from '../dto/request';

@Injectable()
export class YearValidation {
  create({ body }: { body: CreateYearRequest }) {
    const createStudentSchema = joi
      .object<CreateYearRequest>({
        name: validationSchema.language().required(),
        rank: joi.number().integer().required(),
        groupsIds: joi.array().items(validationSchema.id()).required().min(0),
      })
      .required();

    return new JoiValidationPipe(createStudentSchema).transform(body);
  }

  update({ body, params }: { body: UpdateYearRequest; params: Params }) {
    const updateYearSchema = joi
      .object<UpdateYearRequest>({
        id: validationSchema.id(),
        name: validationSchema.language(),
        rank: joi.number().integer(),
        groupsIds: joi.array().items(validationSchema.id()).required().min(0),
      })
      .required();

    this.paramsId({ params });

    return new JoiValidationPipe(updateYearSchema).transform(body);
  }

  get({ query }: { query: GetYearsQuery }) {
    const getYearsQuerySchema = joi.object<GetYearsQuery>({
      search: joi.string().max(50),
    });
    return new JoiValidationPipe(getYearsQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
