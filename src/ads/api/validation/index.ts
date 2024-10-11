import { Injectable } from '@nestjs/common';
import { CreateAdsRequest, UpdateAdsRequest } from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { pagination } from 'package/pagination/validation';
import { GetByCriteria } from 'package/pagination/dto';

@Injectable()
export class AdsValidation {
  create({ body }: { body: CreateAdsRequest }) {
    const create = joi
      .object({
        image: validationSchema.id().required(),
        url: joi.string().required(),
        description: validationSchema.language().optional(),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateAdsRequest; params: Params }) {
    const update = joi
      .object<UpdateAdsRequest>({
        id: validationSchema.id(),
        image: validationSchema.id(),
        url: joi.string(),
        description: validationSchema.language().optional(),
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
