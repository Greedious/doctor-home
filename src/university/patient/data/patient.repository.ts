import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Patient } from './patient.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PatientRepository extends SequelizeRepository<Patient> {
  constructor(
    @InjectModel(Patient)
    patientRepository: typeof Patient,
  ) {
    super(patientRepository);
  }
}
