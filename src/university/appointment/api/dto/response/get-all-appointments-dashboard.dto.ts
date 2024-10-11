import { language } from 'package/utils/language/language';
import { Appointment } from 'src/university/appointment/data/appointment.schema';

export interface IGetByCriteriaAppointmentsDashboardResponse {
  id: number;
  appointment: string;
}

export class GetByCriteriaAppointmentsDashboardResponse {
  // id: number;
  // appointment: string;
  // constructor({
  //   appointment,
  //   languageKey,
  // }: {
  //   appointment: Appointment;
  //   languageKey: string;
  // }) {
  //   this.id = appointment.id;
  //   this.appointment = appointment.appointment[languageKey || 'ar'];
  // }
  // toObject(): IGetByCriteriaAppointmentsDashboardResponse {
  //   return {
  //     id: this.id,
  //     appointment: this.appointment,
  //   };
  // }
}
