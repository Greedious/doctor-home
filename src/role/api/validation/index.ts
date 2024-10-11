import { Injectable } from '@nestjs/common';
import { CreateRoleRequest, UpdateRoleRequest } from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';

@Injectable()
export class RoleValidation {
  create({ body }: { body: CreateRoleRequest }) {
    const create = joi
      .object({
        name: validationSchema.language().required(),
        privileges: joi
          .array()
          .items(validationSchema.id().required())
          .required()
          .min(1),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateRoleRequest; params: Params }) {
    const update = joi
      .object<UpdateRoleRequest>({
        id: validationSchema.id(),
        name: validationSchema.language(),
        privileges: joi.array().items(validationSchema.id().required()).min(1),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(update).transform(body);
  }

  paramsId({ params }: { params: Params }) {
    const id = joi.object({
      id: validationSchema.id().required(),
    });
    return new JoiValidationPipe(id).transform(params);
  }
}
