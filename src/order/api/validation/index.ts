import { Injectable } from '@nestjs/common';
import {
  CreateOrderRequest,
  GetAllOrder,
  GetAllOrderMobile,
  UpdateOrderRequest,
} from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { pagination } from 'package/pagination/validation';
import { GetByCriteria } from 'package/pagination/dto';
import { deliverOption } from 'src/order/data/order.schema';
import { OrderStatus } from 'package/utils/enums';

@Injectable()
export class OrderValidation {
  create({ body }: { body: CreateOrderRequest }) {
    const create = joi
      .object({
        products: joi
          .array()
          .items(
            joi.object({
              id: validationSchema.id().required(),
              quantity: joi.number().min(1).required(),
              price: joi.number().min(0).required(),
            }),
          )
          .unique((a, b) => a.id === b.id),
        coupon: joi.string().min(6).max(6),
        deliverOption: joi
          .string()
          .valid(...Object.values(deliverOption))
          .required(),
        address: validationSchema.id().required(),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }
  update({ body, params }: { body: UpdateOrderRequest; params: Params }) {
    const update = joi
      .object({
        status: joi
          .string()
          .valid(...Object.values(OrderStatus))
          .required(),
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
    const getAll = joi.object({
      ...pagination([true]),
      status: joi.string().valid(...Object.values(OrderStatus)),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
  getAllMobile({ query }: { query: GetAllOrder }) {
    const getAll = joi.object({
      status: joi.string().valid(...Object.values(OrderStatus)),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
}
