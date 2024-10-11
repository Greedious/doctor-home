import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import {
  AddGroupTeacherRequest,
  AssignSubjectRequest,
  CreateTeacherRequest,
  DeleteGroupTeacherRequest,
  DeleteSubjectTeacherRequest,
  GetTeachersQuery,
  UpdateTeacherRequest,
} from '../dto/request';
import { pagination } from 'package/pagination/validation';

@Injectable()
export class TeacherValidation {
  create({ body }: { body: CreateTeacherRequest }) {
    const createTeacherSchema = joi
      .object<CreateTeacherRequest>({
        firstName: joi.string().max(50).required(),
        lastName: joi.string().max(50).required(),
        fatherName: joi.string().max(50).required(),
        motherName: joi.string().max(50).required(),
        specialtyId: validationSchema.id().required(),
        birthDate: joi.date(),
        phoneNumber: validationSchema.phoneNumber(),
      })
      .required();
    return new JoiValidationPipe(createTeacherSchema).transform(body);
  }

  update({ body, params }: { body: UpdateTeacherRequest; params: Params }) {
    const updateTeacherSchema = joi
      .object<UpdateTeacherRequest>({
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
    return new JoiValidationPipe(updateTeacherSchema).transform(body);
  }
  assignSubject({
    body,
    params,
  }: {
    body: AssignSubjectRequest;
    params: Params;
  }) {
    const updateTeacherSchema = joi
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
    return new JoiValidationPipe(updateTeacherSchema).transform(body);
  }
  deleteSubject({
    params,
    body,
  }: {
    params: Params;
    body: DeleteSubjectTeacherRequest;
  }) {
    const remove = joi.object({
      subjectId: validationSchema.id().required(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(remove).transform(body);
  }

  deleteGroupTeacher({
    params,
    body,
  }: {
    params: Params;
    body: DeleteGroupTeacherRequest;
  }) {
    const remove = joi.object({
      groupId: validationSchema.id().required(),
      subjectId: validationSchema.id().required(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(remove).transform(body);
  }

  addGroupTeacher({
    params,
    body,
  }: {
    params: Params;
    body: AddGroupTeacherRequest;
  }) {
    const create = joi.object({
      groupId: validationSchema.id().required(),
      subjectId: validationSchema.id().required(),
    });
    this.paramsId({ params });
    return new JoiValidationPipe(create).transform(body);
  }

  get({ query }: { query: GetTeachersQuery }) {
    const getTeachersQuerySchema = joi.object<GetTeachersQuery>({
      ...pagination([true]),
      search: joi.string().max(50),
    });
    return new JoiValidationPipe(getTeachersQuerySchema).transform(query);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi.object({
      id: validationSchema.id().required(),
    });
    return new JoiValidationPipe(paramsId).transform(params);
  }
  getOneTeacherSubjectParams({
    params,
  }: {
    params: { teacherId: number; subjectId: number };
  }) {
    const paramsId = joi.object({
      teacherId: validationSchema.id().required(),
      subjectId: validationSchema.id().required(),
    });
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getTeacherSubject({ query }: { query: { subjectId: number } }) {
    const getTeachersQuerySchema = joi.object<{ subjectId: number }>({
      subjectId: validationSchema.id().required(),
    });
    return new JoiValidationPipe(getTeachersQuerySchema).transform(query);
  }
}
