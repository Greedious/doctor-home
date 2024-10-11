import { constructFileUrl } from 'package/utils/methods';
import { PatientReport } from 'src/university/patient-report/data/patient-report.schema';
import { Patient } from 'src/university/patient/data/patient.schema';
import { TaskTemplateDocument } from 'src/university/task/data/task-template.schema';

export interface IGetPatientReportsDashboardResponse {
  id: number;
  description: string;
  task: { id: number; name: string };
  treatmentStudent: { id: number; firstName: string; lastName: string };
}
export class GetPatientReportsDashboardResponse {
  id: number;
  description: string;
  task: { id: number; name: string };
  treatmentStudent: { id: number; firstName: string; lastName: string };

  constructor({
    report,
    languageKey,
  }: {
    report: PatientReport;
    languageKey: string;
  }) {
    this.id = report.id;
    this.description = report.description;
    this.task = {
      id: (report.patient.task as TaskTemplateDocument)._id,
      name: (report.patient.task as TaskTemplateDocument).name[languageKey],
    };
    this.treatmentStudent = {
      id: report.patient.student.id,
      firstName: report.patient.student.firstName,
      lastName: report.patient.student.lastName,
    };
  }

  toObject(): IGetPatientReportsDashboardResponse {
    return {
      id: this.id,
      description: this.description,
      task: this.task,
      treatmentStudent: this.treatmentStudent,
    };
  }
}
