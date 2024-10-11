import { Injectable } from '@nestjs/common';

import { PatientReportRepository } from '../data/patient-report.repository';
import { CreatePatientReport, UpdatePatientReport } from '../api/dto/request';
import { PatientReportError } from './patient-report-error.service';

@Injectable()
export class PatientReportMobileService {
  constructor(
    private readonly patientReportRepository: PatientReportRepository,
    private readonly patientReportError: PatientReportError,
  ) {}

  async findOneById(id: number) {
    const report = await this.patientReportRepository.findOne({
      where: { id },
    });
    if (!report) {
      throw this.patientReportError.notFound();
    }
    return report;
  }

  async createReport({
    body,
    patientId,
  }: {
    body: CreatePatientReport;
    patientId: number;
  }) {
    const { appointmentId, ...remData } = body;
    const report = await this.patientReportRepository.create({
      doc: {
        age: remData.patientAge,
        name: remData.patientName,
        description: remData.description,
        patientId,
      },
    });
    return report;
  }

  async updateReport({
    body,
    id,
    patientId,
  }: {
    body: UpdatePatientReport;
    id: number;
    patientId?: number;
  }) {
    const { appointmentId, ...remData } = body;
    const report = await this.findOneById(id);
    await report.update({
      age: remData.patientAge,
      name: remData.patientName,
      description: remData.description,
      patientId,
    });
    return report;
  }

  async delete(id: number) {
    const report = await this.findOneById(id);
    await report.destroy();
    return;
  }
}
