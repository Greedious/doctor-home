import { Injectable } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import * as joi from 'joi';

@Injectable()
export class FavoriteValidation {
  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({
      productId: validationSchema.id().required(),
    });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
