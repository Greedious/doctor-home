import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import {
  CreateSpecialtyRequest,
  GetSpecialtiesQuery,
  UpdateSpecialtyRequest,
} from '../dto/request';
import { pagination } from 'package/pagination/validation';

@Injectable()
export class SpecialtyValidation {
  create({ body }: { body: CreateSpecialtyRequest }) {
    const createSpecialtySchema = joi
      .object<CreateSpecialtyRequest>({
        name: validationSchema.language().required(),
      })
      .required();
    return new JoiValidationPipe(createSpecialtySchema).transform(body);
  }

  update({ body, params }: { body: UpdateSpecialtyRequest; params: Params }) {
    const updateSpecialtySchema = joi
      .object<UpdateSpecialtyRequest>({
        id: validationSchema.id(),
        name: validationSchema.language(),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(updateSpecialtySchema).transform(body);
  }

  get({ query }: { query: GetSpecialtiesQuery }) {
    const getSpecialtiesQuerySchema = joi.object<GetSpecialtiesQuery>({
      ...pagination([true]),
      search: joi.string().max(50),
    });
    return new JoiValidationPipe(getSpecialtiesQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
