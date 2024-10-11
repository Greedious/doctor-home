import { lang } from 'moment';
import { myDayjs } from 'package/utils/my-dayjs';
import { Patient } from 'src/university/patient/data/patient.schema';
import { TaskTemplateDocument } from 'src/university/task/data/task-template.schema';

export interface IGetByCriteriaPatientMobileResponse {
  id: number;
  nationalId?: string;
  name: string;
  phoneNumber: string;
  subject: { id: number; name: string };
  group: { id: number; name: string };
  task: {
    id: string;
    name: string;
  };
  status: string;
  createdAt: string;
}
export class GetByCriteriaPatientMobileResponse {
  id: number;
  nationalId?: string;
  name: string;
  phoneNumber: string;
  subject: { id: number; name: string };
  group: { id: number; name: string };
  task: {
    id: string;
    name: string;
  };
  status: string;
  createdAt: string;

  constructor({
    patient,
    languageKey,
  }: {
    patient: Patient;
    languageKey: string;
  }) {
    this.id = patient.id;
    this.nationalId = patient.nationalId;
    this.name = patient.name;
    this.phoneNumber = patient.phoneNumber;
    this.subject = {
      id: patient.subject.id,
      name: patient.subject.name[languageKey],
    };
    this.group = {
      id: patient.student.groupId,
      name: patient.student.group.name[languageKey],
    };
    this.task = {
      id: (patient.task as TaskTemplateDocument)._id,
      name: (patient.task as TaskTemplateDocument).name[languageKey],
    };
    this.status = patient.status;
    this.createdAt = myDayjs(patient.createdAt).format();
  }

  toObject(): IGetByCriteriaPatientMobileResponse {
    return {
      id: this.id,
      nationalId: this.nationalId,
      name: this.name,
      phoneNumber: this.phoneNumber,
      task: this.task,
      subject: this.subject,
      group: this.group,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
