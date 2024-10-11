import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import {
  CreateChairRequest,
  GetChairsQuery,
  LinkStudentToChairRequest,
  UpdateChairRequest,
} from '../dto/request';
import { pagination } from 'package/pagination/validation';

@Injectable()
export class ChairValidation {
  create({ body }: { body: CreateChairRequest }) {
    const createStudentSchema = joi
      .object<CreateChairRequest>({
        name: validationSchema.language().required(),
        capacity: joi.number().min(1).required(),
        subjectIds: joi
          .array()
          .items(validationSchema.id().required())
          .required(),
      })
      .required();

    return new JoiValidationPipe(createStudentSchema).transform(body);
  }

  update({ body, params }: { body: UpdateChairRequest; params: Params }) {
    const update = joi
      .object<UpdateChairRequest>({
        id: validationSchema.id(),
        name: validationSchema.language(),
        capacity: joi.number().min(1),
        subjectIds: joi
          .array()
          .items(validationSchema.id().required())
          .required(),
      })
      .required();

    this.paramsId({ params });

    return new JoiValidationPipe(update).transform(body);
  }

  linkChairToStudent({ body }: { body: LinkStudentToChairRequest }) {
    const linkChairToStudent = joi
      .object<LinkStudentToChairRequest>({
        chairId: validationSchema.id().required(),
        studentsIds: joi
          .array()
          .items(validationSchema.id().required())
          .min(1)
          .required(),
        subjectId: validationSchema.id().required(),
      })
      .required();
    return new JoiValidationPipe(linkChairToStudent).transform(body);
  }

  get({ query }: { query: GetChairsQuery }) {
    const getChairsQuerySchema = joi.object<GetChairsQuery>({
      ...pagination([true]),
      search: joi.string().max(50),
    });
    return new JoiValidationPipe(getChairsQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
