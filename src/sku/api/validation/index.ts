import { Injectable } from '@nestjs/common';
import {
  CreateSkuRequest,
  GetAllSku,
  GetAllSkuMobile,
  SkuParam,
  UpdateSkuRequest,
} from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';

export const createSkuSchema = joi
  .object({
    image: validationSchema.id().required(),
    price: joi.number().min(0).required(),
    quantity: joi.number().min(0).required(),
    product: validationSchema.id(),
  })
  .required();

@Injectable()
export class SkuValidation {
  create({ body }: { body: CreateSkuRequest }) {
    return new JoiValidationPipe(createSkuSchema).transform(body);
  }

  update({ body, params }: { body: UpdateSkuRequest; params: Params }) {
    const update = joi
      .object({
        name: validationSchema.language(),
        description: validationSchema.language(),
        image: validationSchema.id(),
        price: joi.number().min(0),
        subcategory: validationSchema.id(),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(update).transform(body);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAll({ query, params }: { query: GetAllSku; params: SkuParam }) {
    const getAll = joi.object().pattern(joi.string(), joi.string());
    this.params({ params });

    return new JoiValidationPipe(getAll).transform(query);
  }

  params({ params }: { params: SkuParam }) {
    const paramsId = joi.object({
      productId: validationSchema.id().required(),
    });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAllMobile({ query }: { query: GetAllSkuMobile }) {
    const getAll = joi.object({
      isFeatured: joi.boolean(),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
}
