import { Injectable } from '@nestjs/common';
import {
  CreatePatientRequest,
  GetAllPatientsMobileQuery,
  UpdatePatientRequest,
} from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { pagination } from 'package/pagination/validation';
import { GetByCriteria } from 'package/pagination/dto';
import { IUser } from 'src/shared/types/user';
import { PatientStatus } from '../../data/patient.schema';

@Injectable()
export class PatientValidation {
  create({ body, user }: { body: CreatePatientRequest; user: IUser }) {
    const create = joi
      .object<CreatePatientRequest>({
        nationalId: joi.string().min(11).max(11).required(),
        name: joi.string().max(50).required(),
        phoneNumber: joi.string().max(16).required(),
        availableTime: joi.string().max(255).required(),
        task: validationSchema.mongoId().required(),
        address: joi.string().max(255),
        answers: joi
          .array()
          .items(
            joi.object({
              id: validationSchema.id().required(),
              question: joi.string().required(),
              answer: joi.boolean().required(),
            }),
          )
          .min(0)
          .required(),
        previousDiseases: joi.string().max(255),
        previousDentalDiseases: joi.string().max(50),
        subjectId: validationSchema.id().required(),
        studentId: user.teacher ? validationSchema.id() : joi.forbidden(),
        attachmentsIds: joi.array().items(validationSchema.id()).required(),
      })
      .required();
    return new JoiValidationPipe(create).transform(body);
  }

  update({
    body,
    params,
    user,
  }: {
    body: UpdatePatientRequest;
    params: Params;
    user: IUser;
  }) {
    const update = joi
      .object<UpdatePatientRequest>({
        nationalId: joi.string().min(11).max(11),
        name: joi.string().max(50),
        phoneNumber: joi.string().max(16),
        availableTime: joi.string().max(255),
        task: validationSchema.mongoId(),
        address: joi.string().max(255),
        status: user.teacher
          ? joi.string().valid(...Object.values(PatientStatus))
          : joi.forbidden(),
        previousDiseases: joi.string().max(255),
        previousDentalDiseases: joi.string().max(50),
        subjectId: validationSchema.id(),
        attachmentsIds: joi.array().items(validationSchema.id()),
      })
      .and('task', 'subjectId')
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
      ...pagination([true]),
    });
    return new JoiValidationPipe(getAll).transform(query);
  }

  getAllMobile({ query }: { query: GetAllPatientsMobileQuery }) {
    const getAll = joi.object<any>({
      ...pagination([true]),
      search: joi.string().max(24),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
}
