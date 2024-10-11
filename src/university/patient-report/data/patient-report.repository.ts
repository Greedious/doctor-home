import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { PatientReport } from './patient-report.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PatientReportRepository extends SequelizeRepository<PatientReport> {
  constructor(
    @InjectModel(PatientReport)
    patientReportRepository: typeof PatientReport,
  ) {
    super(patientReportRepository);
  }
}
