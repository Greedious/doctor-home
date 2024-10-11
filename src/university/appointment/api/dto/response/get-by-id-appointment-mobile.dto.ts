import { Appointment } from 'src/university/appointment/data/appointment.schema';

export interface IGetByIdAppointmentMobileResponse {
  id: number;
  chair: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    name: string;
  };
  subject: {
    id: number;
    name: string;
  };
  from: Date;
  to: Date;
}

export class GetByIdAppointmentMobileResponse {
  id: number;
  chair: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    name: string;
  };
  subject: {
    id: number;
    name: string;
  };
  from: Date;
  to: Date;

  constructor({
    appointment,
    languageKey,
  }: {
    appointment: Appointment;
    languageKey: string;
  }) {
    this.id = appointment.id;
    this.chair = {
      id: appointment.chair.id,
      name: appointment.chair.name[languageKey],
    };
    this.subject = {
      id: appointment.subject.id,
      name: appointment.subject.name[languageKey],
    };

    this.student = {
      id: appointment.student.id,
      name: appointment.student.firstName + ' ' + appointment.student.lastName,
    };
    this.from = appointment.from;
    this.to = appointment.to;
  }
  toObject(): IGetByIdAppointmentMobileResponse {
    return {
      id: this.id,
      student: this.student,
      chair: this.chair,
      subject: this.subject,
      from: this.from,
      to: this.to,
    };
  }
}
