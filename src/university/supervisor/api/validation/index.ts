import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import {
  AddGroupSupervisorRequest,
  AssignSubjectRequest,
  CreateSupervisorRequest,
  DeleteGroupSupervisorRequest,
  DeleteSubjectSupervisorRequest,
  GetSupervisorsQuery,
  UpdateSupervisorRequest,
} from '../dto/request';
import { pagination } from 'package/pagination/validation';

@Injectable()
export class SupervisorValidation {
  create({ body }: { body: CreateSupervisorRequest }) {
    const createSupervisorSchema = joi
      .object<CreateSupervisorRequest>({
        firstName: joi.string().max(50).required(),
        lastName: joi.string().max(50).required(),
        fatherName: joi.string().max(50).required(),
        motherName: joi.string().max(50).required(),
        specialtyId: validationSchema.id().required(),
        birthDate: joi.date(),
        phoneNumber: validationSchema.phoneNumber(),
        subjectId: validationSchema.id(),
      })
      .required();
    return new JoiValidationPipe(createSupervisorSchema).transform(body);
  }

  update({ body, params }: { body: UpdateSupervisorRequest; params: Params }) {
    const updateSupervisorSchema = joi
      .object<UpdateSupervisorRequest>({
        id: validationSchema.id(),
        firstName: joi.string().max(50),
        lastName: joi.string().max(50),
        fatherName: joi.string().max(50),
        motherName: joi.string().max(50),
        specialtyId: validationSchema.id(),
        birthDate: joi.date(),
        phoneNumber: validationSchema.phoneNumber(),
      })
      .required()
      .options({ allowUnknown: true });
    this.paramsId({ params });
    return new JoiValidationPipe(updateSupervisorSchema).transform(body);
  }
  assignSubject({
    body,
    params,
  }: {
    body: AssignSubjectRequest;
    params: Params;
  }) {
    const updateSupervisorSchema = joi
      .object<AssignSubjectRequest>({
        subjectId: validationSchema.id().required(),
        groups: joi
          .array()
          .items(validationSchema.id().required())
          .min(1)
          .required(),
      })
      .required();
    this.paramsId({ params });
    return new JoiValidationPipe(updateSupervisorSchema).transform(body);
  }
  deleteSubject({
    params,
    body,
  }: {
    params: Params;
    body: DeleteSubjectSupervisorRequest;
  }) {
    const remove = joi.object({
      subjectId: validationSchema.id().required(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(remove).transform(body);
  }

  deleteGroupSupervisor({
    params,
    body,
  }: {
    params: Params;
    body: DeleteGroupSupervisorRequest;
  }) {
    const remove = joi.object({
      groupId: validationSchema.id().required(),
      subjectId: validationSchema.id().required(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(remove).transform(body);
  }

  addGroupSupervisor({
    params,
    body,
  }: {
    params: Params;
    body: AddGroupSupervisorRequest;
  }) {
    const create = joi.object({
      groupId: validationSchema.id().required(),
      subjectId: validationSchema.id().required(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(create).transform(body);
  }

  get({ query }: { query: GetSupervisorsQuery }) {
    const getSupervisorsQuerySchema = joi.object<GetSupervisorsQuery>({
      ...pagination([true]),
      search: joi.string().max(50),
    });
    return new JoiValidationPipe(getSupervisorsQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({
      id: validationSchema.id().required(),
    });
    return new JoiValidationPipe(paramsId).transform(params);
  }
  getOneSupervisorSubjectParams({
    params,
  }: {
    params: { supervisorId: number; subjectId: number };
  }) {
    const paramsId = joi.object({
      supervisorId: validationSchema.id().required(),
      subjectId: validationSchema.id().required(),
    });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getSupervisorSubject({ query }: { query: { subjectId: number } }) {
    const getSupervisorsQuerySchema = joi.object<{ subjectId: number }>({
      subjectId: validationSchema.id().required(),
    });
    return new JoiValidationPipe(getSupervisorsQuerySchema).transform(query);
  }
}
