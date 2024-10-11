import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { id } from 'package/validation/schema';
import { validationSchema } from 'package/validation';
import { Params } from 'package/component/params/params';
import { CreateAddress } from '../dto/request';

@Injectable()
export class AddressValidation {
  create({ body }: { body: CreateAddress }) {
    const createSchema = joi.object({
      title: joi.string().required().max(16).required(),
      zone: joi.string().required().max(16).required(),
      street: joi.string().required().max(16).required(),
      building: joi.string().required().max(16).required(),
      floor: joi.string().required().max(16).required(),
      flat: joi.string().required().max(16),
    });
    return new JoiValidationPipe(createSchema).transform(body);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
