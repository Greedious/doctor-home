import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import {
  CreateStudentRequest,
  GetStudentsQuery,
  UpdateStudentRequest,
} from '../dto/request';
import { pagination } from 'package/pagination/validation';

@Injectable()
export class StudentValidation {
  create({ body }: { body: CreateStudentRequest }) {
    const createStudentSchema = joi
      .object<CreateStudentRequest>({
        firstName: joi.string().max(50).required(),
        lastName: joi.string().max(50).required(),
        fatherName: joi.string().max(50).required(),
        motherName: joi.string().max(50).required(),
        yearId: validationSchema.id(),
        groupId: joi.when('yearId', {
          is: joi.exist(),
          then: validationSchema.id().required(),
          otherwise: joi.forbidden(),
        }),
        phoneNumber: validationSchema.phoneNumber(),
        birthDate: joi.date(),
      })
      .required();
    return new JoiValidationPipe(createStudentSchema).transform(body);
  }

  update({ body, params }: { body: UpdateStudentRequest; params: Params }) {
    const updateStudentSchema = joi
      .object<UpdateStudentRequest>({
        id: validationSchema.id(),
        firstName: joi.string().max(50),
        lastName: joi.string().max(50),
        fatherName: joi.string().max(50),
        motherName: joi.string().max(50),
        year: validationSchema.id(),
        group: joi.when('year', {
          is: joi.exist(),
          then: validationSchema.id(),
          otherwise: joi.forbidden(),
        }),
        birthDate: joi.date(),
        phoneNumber: validationSchema.phoneNumber(),
      })
      .required();

    this.paramsId({ params });
    return new JoiValidationPipe(updateStudentSchema).transform(body);
  }

  get({ query }: { query: GetStudentsQuery }) {
    const getStudentsQuerySchema = joi.object<GetStudentsQuery>({
      ...pagination([true]),
      search: joi.string().max(50),
    });
    return new JoiValidationPipe(getStudentsQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }
}
