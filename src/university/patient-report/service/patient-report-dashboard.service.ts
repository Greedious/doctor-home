import { Injectable } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { PatientReportError } from './patient-report-error.service';
import { PatientReportRepository } from '../data/patient-report.repository';
import { WhereOptions } from 'sequelize';
import { PatientReport } from '../data/patient-report.schema';
import { Patient } from 'src/university/patient/data/patient.schema';
import { Student } from 'src/university/student/data/student.schema';
import { TaskTemplateRepository } from 'src/university/task/data/task.repository';
import { TaskError } from 'src/university/task/service/task-error.service';

@Injectable()
export class PatientReportDashboardService {
  constructor(
    private readonly patientReportRepository: PatientReportRepository,
    private readonly patientError: PatientReportError,
    private readonly taskTemplateRepository: TaskTemplateRepository,
    private readonly taskError: TaskError,
  ) {}

  async findPatientReport(nationalId: string) {
    const reports = await this.patientReportRepository.findAll({
      include: [
        {
          model: Patient,
          include: [Student],
          where: { nationalId },
          required: true,
        },
      ],
    });
    for (const report of reports) {
      const task = await this.taskTemplateRepository.findOne({
        filter: { _id: report.patient.task },
        error: this.taskError.notFound(),
      });
      report.patient.task = task;
    }
    return reports;
  }
}
