import { Appointment } from 'src/university/appointment/data/appointment.schema';

export interface IGetByCriteriaAppointmentsMobileResponse {
  id: number;
  chair: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  group: {
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

export class GetByCriteriaAppointmentsMobileResponse {
  id: number;
  chair: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  group: {
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
    this.group = {
      id: appointment.student.group.id,
      name: appointment.student.group.name[languageKey],
    };

    this.student = {
      id: appointment.student.id,
      firstName: appointment.student.firstName,
      lastName: appointment.student.lastName,
    };
    this.from = appointment.from;
    this.to = appointment.to;
  }
  toObject(): IGetByCriteriaAppointmentsMobileResponse {
    return {
      id: this.id,
      student: this.student,
      chair: this.chair,
      group: this.group,
      subject: this.subject,
      from: this.from,
      to: this.to,
    };
  }
}
