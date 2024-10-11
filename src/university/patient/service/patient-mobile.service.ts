import { Injectable } from '@nestjs/common';
import { PatientError } from './patient-error.service';
import { Subject } from 'src/university/subject/data/subject.schema';
import { PatientRepository } from '../data/patient.repository';
import { Transaction, WhereOptions } from 'sequelize';
import { Params } from 'package/component/params/params';
import { Patient, PatientStatus } from '../data/patient.schema';
import { Image } from 'src/image/data/image.schema';
import { CreatePatientRequest, UpdatePatientRequest } from '../api/dto/request';
import { Student } from 'src/university/student/data/student.schema';
import { Teacher } from 'src/university/teacher/data/teacher.schema';
import { TaskTemplateRepository } from 'src/university/task/data/task.repository';
import { TaskError } from 'src/university/task/service/task-error.service';
import mongoose from 'mongoose';
import { IUser } from 'src/shared/types/user';
import { Group } from 'src/university/group/data/group.schema';

@Injectable()
export class PatientMobileService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly taskTemplateRepository: TaskTemplateRepository,
    private readonly patientError: PatientError,
    private readonly taskError: TaskError,
  ) {}

  async create(body: CreatePatientRequest, transaction: Transaction) {
    const { attachmentsIds, answers, ...remData } = body;
    const patient = await this.patientRepository.create({
      doc: {
        ...remData,
        answers: answers.map((answer) => {
          return {
            question: answer.question,
            answer: answer.answer,
          };
        }),
        status: body.teacherId ? PatientStatus.APPROVED : PatientStatus.PENDING,
      },
      options: { transaction },
    });
    await patient.$set('attachments', attachmentsIds, { transaction });
    return patient;
  }

  async update(
    body: UpdatePatientRequest,
    user: IUser,
    id: number,
    transaction: Transaction,
  ) {
    const { attachmentsIds, ...remData } = body;

    const filter: WhereOptions<Patient> = { id, status: PatientStatus.PENDING };
    if (user.student) filter.studentId = user.student;

    const patient = await this.patientRepository.findOne({
      where: filter,
      error: this.patientError.notFound(),
    });

    await patient.update(remData, { transaction });
    if (attachmentsIds && attachmentsIds.length)
      await patient.$set('attachments', attachmentsIds, { transaction });
    return patient;
  }

  async findOneById(id: number) {
    const subject = await this.patientRepository.findOne({
      where: { id },
      error: this.patientError.notFound(),
    });
    return subject;
  }

  async findOne({ id }: Params) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      error: this.patientError.notFound(),
      include: [Image, Student, Subject, Teacher],
    });
    patient.task = await this.taskTemplateRepository.findOne({
      filter: {
        _id: new mongoose.Types.ObjectId(
          patient.task as mongoose.Types.ObjectId,
        ),
      },
      error: this.taskError.notFound(),
    });

    return patient;
  }

  async findAll(
    filter: WhereOptions<Patient>,
    { limit, skip }: { limit: number; skip: number },
  ) {
    const patients = await this.patientRepository.findAndCount({
      where: filter,
      options: { limit, offset: skip },
      include: [Subject, { model: Student, include: [Group] }],
    });
    for (const patient of patients.rows) {
      patient.task = await this.taskTemplateRepository.findOne({
        filter: {
          _id: new mongoose.Types.ObjectId(
            patient.task as mongoose.Types.ObjectId,
          ),
        },
        error: this.taskError.notFound(),
      });
    }
    return patients;
  }

  async delete(id: number, user: IUser) {
    await this.patientRepository.delete({
      where: { id, studentId: user.student },
    });
    return;
  }
}
