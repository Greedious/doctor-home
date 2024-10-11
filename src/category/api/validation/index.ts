import { Injectable } from '@nestjs/common';
import {
  CreateCategoryRequest,
  GetAllCategoryMobile,
  UpdateCategoryRequest,
} from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { pagination } from 'package/pagination/validation';
import { GetByCriteria } from 'package/pagination/dto';

@Injectable()
export class CategoryValidation {
  create({ body }: { body: CreateCategoryRequest }) {
    const create = joi
      .object({
        name: validationSchema.language().required(),
        image: validationSchema.id().required(),
        subcategories: joi
          .array()
          .items(
            joi.object({
              name: validationSchema.language().required(),
            }),
          )
          .required()
          .min(1),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }
  createSubcategory({
    body,
    params,
  }: {
    body: CreateCategoryRequest;
    params: Params;
  }) {
    const create = joi
      .object({
        name: validationSchema.language().required(),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateCategoryRequest; params: Params }) {
    const update = joi
      .object<UpdateCategoryRequest>({
        id: validationSchema.id(),
        name: validationSchema.language(),
        image: validationSchema.id(),
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
      ...pagination([false]),
      parent: validationSchema.id(),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
  getAllMobile({ query }: { query: GetAllCategoryMobile }) {
    const getAll = joi.object({
      isFeatured: joi.boolean(),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
}
