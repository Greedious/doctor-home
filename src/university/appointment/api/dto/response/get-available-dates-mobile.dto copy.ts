import { formateToAmPm } from 'package/utils/format-date';
import { Appointment } from 'src/university/appointment/data/appointment.schema';

export interface IGetNonAvailableDatesMobileResponse {
  id: number;
  from: string;
  to: string;
}

export class GetNonAvailableDatesMobileResponse {
  id: number;
  from: string;
  to: string;

  constructor({
    appointment,
    languageKey,
  }: {
    appointment: Appointment;
    languageKey: string;
  }) {
    this.id = appointment.id;
    this.from = formateToAmPm(appointment.from);
    this.to = formateToAmPm(appointment.to);
  }
  toObject(): IGetNonAvailableDatesMobileResponse {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
    };
  }
}
