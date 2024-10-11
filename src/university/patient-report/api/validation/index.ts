import { Injectable } from '@nestjs/common';

import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { pagination } from 'package/pagination/validation';
import { GetByCriteria } from 'package/pagination/dto';
import { IUser } from 'src/shared/types/user';
import { CreatePatientReport, UpdatePatientReport } from '../dto/request';

@Injectable()
export class PatientReportValidation {
  create({ body }: { body: CreatePatientReport }) {
    const create = joi
      .object<CreatePatientReport>({
        appointmentId: validationSchema.id().required(),
        description: joi.string().max(512).required(),
        patientAge: joi.number().integer().required(),
        patientName: joi.string().max(50).required(),
      })
      .required();

    return new JoiValidationPipe(create).transform(body);
  }
  update({ body }: { body: UpdatePatientReport }) {
    const update = joi
      .object<UpdatePatientReport>({
        appointmentId: validationSchema.id(),
        description: joi.string().max(512),
        patientAge: joi.number().integer(),
        patientName: joi.string().max(50),
      })
      .required();

    return new JoiValidationPipe(update).transform(body);
  }
  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({ id: validationSchema.id().required() });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAll({ query }: { query: GetByCriteria }) {
    const getAll = joi.object({});
    return new JoiValidationPipe(getAll).transform(query);
  }

  getReport({ params }: { params: { nationalId: string } }) {
    const paramsNationalId = joi.object({
      nationalId: joi.string().min(11).max(11).required(),
    });
    return new JoiValidationPipe(paramsNationalId).transform(params);
  }
}
