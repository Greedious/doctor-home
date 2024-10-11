import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { CreateVariant, UpdateVariant } from '../dto/request';
import { language } from 'package/validation/schema';
import { VariantType } from 'src/variant/data/variant.schema';

export const createVariantSchema = joi.object<CreateVariant>({
  name: validationSchema.language().required(),
  type: joi.string().valid(VariantType).required(),
  values: joi.array().items(joi.string().required()).required(),
  productId: validationSchema.id(),
});
export const updateVariantSchema = joi.object<UpdateVariant>({
  id: validationSchema.id(),
  name: validationSchema.language().required(),
  type: joi.string().valid(VariantType).required(),
  values: joi.array().items(joi.string().required()).required(),
  productId: validationSchema.id(),
});

@Injectable()
export class VariantValidation {
  create({ body }: { body: CreateVariant }) {
    return new JoiValidationPipe(createVariantSchema).transform(body);
  }
  update({ body }: { body: UpdateVariant }) {
    return new JoiValidationPipe(updateVariantSchema).transform(body);
  }
}
