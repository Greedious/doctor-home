import { Injectable } from '@nestjs/common';
import { CreatePatientRequest, UpdatePatientRequest } from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { PatientError } from './patient-error.service';
import { PatientRepository } from '../data/patient.repository';
import { Sequelize, WhereOptions } from 'sequelize';
import { Patient } from '../data/patient.schema';

@Injectable()
export class PatientDashboardService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly patientError: PatientError,
  ) {}

  async findUniquePatients(payload: {
    filter: WhereOptions<Patient>;
    skip: number;
    limit: number;
  }) {
    const { filter } = payload;
    const results = await Patient.findAll({
      where: filter,
      attributes: [
        'nationalId',
        [Sequelize.fn('MAX', Sequelize.col('name')), 'name'],
      ],
      group: ['nationalId'],
      raw: true, // Returns plain objects instead of instances of the Patient model
    });

    return results;
  }
}
