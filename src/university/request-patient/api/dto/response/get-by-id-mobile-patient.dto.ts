import { constructFileUrl } from 'package/utils/methods';
import { Patient } from 'src/university/patient/data/patient.schema';
import { TaskTemplateDocument } from 'src/university/task/data/task-template.schema';

interface IGetByIdPatientMobileResponse {
  id: number;
  name: string;
  phoneNumber: string;
  address?: string;
  availableTime: string;
  subject: { id: number; name: string };
  task: {
    id: string;
    name: string;
  };
  status: string;
  previousDiseases?: string;
  previousDentalDiseases?: string;
  student: { id: number; firstName: string; lastName: string };
  teacher?: { id: number; firstName: string; lastName: string };
  attachments: string[];
}
export class GetByIdPatientMobileResponse {
  id: number;
  name: string;
  phoneNumber: string;
  address?: string;
  availableTime: string;
  subject: { id: number; name: string };
  task: {
    id: string;
    name: string;
  };
  status: string;
  previousDiseases?: string;
  previousDentalDiseases?: string;
  attachments?: string[];
  student: { id: number; firstName: string; lastName: string };
  teacher?: { id: number; firstName: string; lastName: string };

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
    this.address = patient.address;
    this.availableTime = patient.availableTime;
    this.status = patient.status;
    this.subject = {
      id: patient.subject.id,
      name: patient.subject.name[languageKey],
    };
    this.task = {
      id: (patient.task as TaskTemplateDocument)._id,
      name: (patient.task as TaskTemplateDocument).name[languageKey],
    };
    this.previousDentalDiseases = patient.previousDentalDiseases;
    this.previousDiseases = patient.previousDiseases;
    this.attachments = patient.attachments.map((attachment) =>
      constructFileUrl(attachment.key),
    );
    this.student = {
      id: patient.studentId,
      firstName: patient.student.firstName,
      lastName: patient.student.lastName,
    };
    this.teacher = patient.teacher
      ? {
          id: patient.teacherId,
          firstName: patient.teacher.firstName,
          lastName: patient.teacher.lastName,
        }
      : undefined;
  }

  toObject(): IGetByIdPatientMobileResponse {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      address: this.address,
      availableTime: this.availableTime,
      task: this.task,
      subject: this.subject,
      previousDiseases: this.previousDiseases,
      previousDentalDiseases: this.previousDentalDiseases,
      attachments: this.attachments,
      status: this.status,
      student: this.student,
      teacher: this.teacher,
    };
  }
}
