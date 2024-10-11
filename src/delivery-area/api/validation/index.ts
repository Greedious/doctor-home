import { Injectable } from '@nestjs/common';
import { CreateDeliveryAreaRequest, UpdateDeliveryArea } from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { GetByCriteria } from 'package/pagination/dto';

@Injectable()
export class DeliveryAreaValidation {
  create({ body }: { body: CreateDeliveryAreaRequest }) {
    const create = joi
      .object({
        area: validationSchema.language().required(),
        time: validationSchema.language().required(),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateDeliveryArea; params: Params }) {
    const update = joi
      .object<UpdateDeliveryArea>({
        id: validationSchema.id(),
        area: validationSchema.language(),
        time: validationSchema.language(),
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
