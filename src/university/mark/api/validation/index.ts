import { Injectable } from '@nestjs/common';
import { SetMarkRequest } from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
@Injectable()
export class MarkValidation {
  constructor() {}

  setMark({ body }: { body: SetMarkRequest }) {
    const setMark = joi
      .object<SetMarkRequest>({
        mark: joi.number().integer().required(),
      })
      .required();
    return new JoiValidationPipe(setMark).transform(body);
  }
  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
