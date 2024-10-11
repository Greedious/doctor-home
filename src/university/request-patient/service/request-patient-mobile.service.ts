import { Injectable } from '@nestjs/common';
import { RequestPatient } from '../api/dto/request';
import { RequestPatientRepository } from '../data/request-patient.repository';
import { IUser } from 'src/shared/types/user';

@Injectable()
export class RequestPatientMobileService {
  constructor(private readonly patientRepository: RequestPatientRepository) {}

  private helperMethods = {};

  async create(body: RequestPatient, user: IUser) {
    const patient = await this.patientRepository.create({
      doc: {
        ...body,
        studentId: user.student,
      },
    });
    return { id: patient.id };
  }
}
