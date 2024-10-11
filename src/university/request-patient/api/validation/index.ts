import { Injectable } from '@nestjs/common';

import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { pagination } from 'package/pagination/validation';
import { RequestPatient } from '../dto/request';

@Injectable()
export class RequestPatientValidation {
  create({ body }: { body: RequestPatient }) {
    const create = joi
      .object<RequestPatient>({
        subjectId: validationSchema.id().required(),
        task: validationSchema.mongoId().required(),
      })
      .required();
    return new JoiValidationPipe(create).transform(body);
  }
}
