import { language } from 'package/utils/language/language';
import { Appointment } from 'src/university/appointment/data/appointment.schema';

export interface IGetByIdAppointmentDashboardResponse {
  id: number;
}

export class GetByIdAppointmentDashboardResponse {
  id: number;

  constructor({
    appointment,
    languageKey,
  }: {
    appointment: Appointment;
    languageKey: string;
  }) {
    this.id = appointment.id;
  }

  toObject(): IGetByIdAppointmentDashboardResponse {
    return {
      id: this.id,
    };
  }
}
