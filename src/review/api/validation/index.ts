import { Injectable } from '@nestjs/common';
import { CreateReviewRequest, GetAllReviewsQuery } from '../dto/request';
import * as joi from 'joi';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { pagination } from 'package/pagination/validation';
import { validationSchema } from 'package/validation';
import { Params } from 'package/component/params/params';

@Injectable()
export class ReviewValidation {
  create({ body }: { body: CreateReviewRequest }) {
    const createReviewSchema = joi
      .object<CreateReviewRequest>({
        comment: joi.string(),
        rate: joi.number().min(1).max(5).required(),
        product: validationSchema.id().required(),
      })
      .required(); // This means percentage or value should be provided exactly 1 of them
    return new JoiValidationPipe(createReviewSchema).transform(body);
  }

  getAll({ query }: { query: GetAllReviewsQuery }) {
    const getAllQuerySchema = joi.object({
      ...pagination([true]),
      product: validationSchema.id().required(),
    });
    return new JoiValidationPipe(getAllQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
