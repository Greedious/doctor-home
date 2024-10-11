import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { UpdateStatusRequest, universityStatus } from '../dto/request';

@Injectable()
export class StatusValidation {
  update({ body }: { body: UpdateStatusRequest }) {
    const updateStatusSchema = joi
      .object<UpdateStatusRequest>({
        status: joi.string().valid(...Object.values(universityStatus)),
      })
      .required();

    return new JoiValidationPipe(updateStatusSchema).transform(body);
  }
}
