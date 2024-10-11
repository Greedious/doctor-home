import { Injectable } from '@nestjs/common';
import {
  CreateAppointmentRequest,
  GetOneAppointment,
  UpdateAppointment,
} from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { GetByCriteria } from 'package/pagination/dto';
import { IUser } from 'src/shared/types/user';
import { pagination } from 'package/pagination/validation';
import { GetNonAvailableDatesRequest } from 'src/university/subject/api/dto/request';

@Injectable()
export class AppointmentValidation {
  create({ body }: { body: CreateAppointmentRequest }) {
    const create = joi
      .object({
        subjectId: validationSchema.id().required(),
        from: joi.date().required(),
        to: joi.date().required(),
        patientId: validationSchema.id().allow(null),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }

  update({ body, params }: { body: UpdateAppointment; params: Params }) {
    const update = joi
      .object<UpdateAppointment>({
        id: validationSchema.id(),
        appointment: validationSchema.language().optional(),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(update).transform(body);
  }

  getOneAppointment({
    params,
    query,
    user,
  }: {
    params: Params;
    query: GetOneAppointment;
    user: IUser;
  }) {
    const getOne = joi.object<GetOneAppointment>({
      studentId: user.teacher
        ? validationSchema.id().required()
        : joi.forbidden(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(getOne).transform(query);
  }

  getAllNonAvailable({
    params,
    query,
  }: {
    params: Params;
    query: GetNonAvailableDatesRequest;
  }) {
    const get = joi
      .object({
        date: joi.date(),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(get).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAll({ query }: { query: GetByCriteria }) {
    const getAll = joi.object({
      ...pagination([true]),
      past: joi.boolean(),
    });
    return new JoiValidationPipe(getAll).transform(query);
  }
}
