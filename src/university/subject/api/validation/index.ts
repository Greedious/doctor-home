import { Injectable } from '@nestjs/common';
import {
  CreateNote,
  CreateSubjectRequest,
  GetAllSubjectMobileQuery,
  GetCard,
  UpdateFields,
  UpdateSubjectRequest,
} from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { MongooseParams, Params } from 'package/component/params/params';
import { pagination } from 'package/pagination/validation';
import { GetByCriteria } from 'package/pagination/dto';
import { IUser } from 'src/shared/types/user';

@Injectable()
export class SubjectValidation {
  create({ body }: { body: CreateSubjectRequest }) {
    const create = joi
      .object<CreateSubjectRequest>({
        name: validationSchema.language().required(),
        season: joi.number().min(1).max(2).required(),
        yearId: validationSchema.id().required(),
      })
      .required();
    return new JoiValidationPipe(create).transform(body);
  }

  update({ body }: { body: UpdateSubjectRequest }) {
    const update = joi
      .object<UpdateSubjectRequest>({
        id: validationSchema.id(),
        name: validationSchema.language(),
        season: joi.number().min(1).max(2),
        yearId: validationSchema.id(),
      })
      .required();

    return new JoiValidationPipe(update).transform(body);
  }

  getCard({
    params,
    query,
    user,
  }: {
    params: Params;
    query: GetCard;
    user: IUser;
  }) {
    const getCard = joi.object({
      studentId: user.teacher
        ? validationSchema.id().required()
        : validationSchema.id().forbidden(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(getCard).transform(query);
  }

  updateFields({
    body,
    params,
    query,
    user,
  }: {
    body: UpdateFields;
    params: Params;
    query: GetCard;
    user: IUser;
  }) {
    const update = joi.object({
      fields: joi
        .array()
        .items(
          joi.object({
            id: validationSchema.mongoId().required(),
            value: joi.alternatives().try(joi.string(), joi.boolean()),
          }),
        )
        .min(1)
        .required(),
    });
    this.getCard({ params, query, user });
    return new JoiValidationPipe(update).transform(body);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  mongoDbParamsId({ params }: { params: MongooseParams }) {
    const paramsId = joi.object({ id: validationSchema.mongoId().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAll({ query }: { query: GetByCriteria }) {
    const getAll = joi.object({
      ...pagination([true]),
      search: joi.string(),
      season: joi.number().min(1).max(2),
      yearId: validationSchema.id(),
    });
    return new JoiValidationPipe(getAll).transform(query);
  }

  createNote({
    body,
    params,
    query,
    user,
  }: {
    body: CreateNote;
    params: Params;
    query: GetCard;
    user: IUser;
  }) {
    const create = joi.object({
      message: joi.string().required(),
    });
    this.getCard({ params, user, query });
    return new JoiValidationPipe(create).transform(body);
  }

  getAllMobile({ query }: { query: GetAllSubjectMobileQuery }) {
    const getAll = joi.object<GetAllSubjectMobileQuery>({
      ...pagination([true]),
      search: joi.string(),
      year: joi.number().min(1).max(5),
      season: joi.number().min(1).max(2),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
}
