import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { UploadImage } from '../dto';

@Injectable()
export class UploadValidation {
  uploadImage({ body }: { body: UploadImage }) {
    const addImageSchema = joi.object({
      title: joi.string().required().max(16),
    });
    return new JoiValidationPipe(addImageSchema).transform(body);
  }
}
