import { Patient } from 'src/university/patient/data/patient.schema';
import { TaskTemplateDocument } from 'src/university/task/data/task-template.schema';

export interface IGetByCriteriaPatientMobileResponse {
  id: number;
  name: string;
  phoneNumber: string;
  subject: { id: number; name: string };
  task: {
    id: string;
    name: string;
  };
  status: string;
}
export class GetByCriteriaPatientMobileResponse {
  id: number;
  name: string;
  phoneNumber: string;
  subject: { id: number; name: string };
  task: {
    id: string;
    name: string;
  };
  status: string;

  constructor({
    patient,
    languageKey,
  }: {
    patient: Patient;
    languageKey: string;
  }) {
    this.id = patient.id;
    this.name = patient.name;
    this.phoneNumber = patient.phoneNumber;
    this.subject = {
      id: patient.subject.id,
      name: patient.subject.name[languageKey],
    };
    this.task = {
      id: (patient.task as TaskTemplateDocument)._id,
      name: (patient.task as TaskTemplateDocument).name[languageKey],
    };
    this.status = patient.status;
  }

  toObject(): IGetByCriteriaPatientMobileResponse {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      task: this.task,
      subject: this.subject,
      status: this.status,
    };
  }
}
