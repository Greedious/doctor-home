import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PatientRepository } from '../data/patient.repository';
import { PatientError } from './patient-error.service';
import { Op, WhereOptions } from 'sequelize';
import { Patient } from '../data/patient.schema';

@Injectable()
export class PatientService {
  constructor(
    private patientRepository: PatientRepository,
    private patientError: PatientError,
  ) {}

  async getMyPatientById(id: number, studentId: number) {
    return await this.patientRepository.findOne({
      where: {
        id,
        studentId,
      },
      error: this.patientError.notFound(),
    });
  }

  async findOne(id: number) {
    return await this.patientRepository.findOne({
      where: { id },
      error: this.patientError.notFound(),
    });
  }

  async countPatients(whereOptions: WhereOptions<Patient>) {
    const count = await this.patientRepository.count({ where: whereOptions });
    return count;
  }

  async checkSubjects(ids: number[]) {
    const patientsCount = await this.patientRepository.count({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    if (patientsCount !== ids.length) {
      throw new HttpException(
        this.patientError.notFound(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return;
  }
}
