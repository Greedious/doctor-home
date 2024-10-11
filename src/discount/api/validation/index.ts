import { Injectable } from '@nestjs/common';
import {
  CheckCoupon,
  CreateDiscountRequest,
  GetAllDiscountsQuery,
  UpdateDiscount,
} from '../dto/request';
import * as joi from 'joi';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { pagination } from 'package/pagination/validation';
import { validationSchema } from 'package/validation';
import { Params } from 'package/component/params/params';

@Injectable()
export class DiscountValidation {
  create({ body }: { body: CreateDiscountRequest }) {
    const createDiscountSchema = joi
      .object<CreateDiscountRequest>({
        percentage: joi.number().integer().min(1).max(100),
        value: joi.number().min(0),
        code: joi.string().min(6).max(6).required(),
        from: joi.date().required(),
        to: joi.date().required().greater(joi.ref('from')),
        subcategory: validationSchema.id().optional(),
      })
      .xor('percentage', 'value')
      .required(); // This means percentage or value should be provided exactly 1 of them
    return new JoiValidationPipe(createDiscountSchema).transform(body);
  }
  patch({ body }: { body: UpdateDiscount }) {
    const updateDiscountSchema = joi
      .object<UpdateDiscount>({
        id: joi.number().integer().min(1).required(),
        percentage: joi.number().integer().min(1).max(100),
        value: joi.number().min(0),
        code: joi.string().min(6).max(6).required(),
        from: joi.date().required(),
        to: joi.date().required().greater(joi.ref('from')),
        subcategoryId: validationSchema.id().optional(),
      })
      .xor('percentage', 'value'); // This means percentage or value should be provided exactly 1 of them
    return new JoiValidationPipe(updateDiscountSchema).transform(body);
  }

  getAll({ query }: { query: GetAllDiscountsQuery }) {
    const getAllQuerySchema = joi.object<GetAllDiscountsQuery>({
      ...pagination([true]),
      from: joi.date(),
      to: joi.date().greater(joi.ref('from')),
      subcategoryId: validationSchema.id().optional(),
    });
    return new JoiValidationPipe(getAllQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  checkCoupon({ body }: { body: CheckCoupon }) {
    const check = joi.object({
      code: joi.string().required(),
      products: joi
        .array()
        .items(
          joi
            .object({
              id: validationSchema.id().required(),
              quantity: joi.number().required().min(1),
              price: joi.number().required().min(0),
            })
            .required(),
        )
        .min(1)
        .required(),
    });
    return new JoiValidationPipe(check).transform(body);
  }
}
