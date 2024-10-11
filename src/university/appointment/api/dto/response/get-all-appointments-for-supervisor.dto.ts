// import { Appointment } from 'src/university/appointment/data/appointment.schema';
// import { PatientStatus } from 'src/university/patient/data/patient.schema';

// export interface IGetByCriteriaAppointmentsMobileSupervisorResponse {
//   id: number;
//   student: {
//     id: number;
//     firstName: string;
//     lastName: string;
//   };
//   group: {
//     id: number;
//     name: string;
//   };
//   status: PatientStatus;
//   from: Date;
//   to: Date;
// }

// export class GetByCriteriaAppointmentsMobileSupervisorResponse {
//   id: number;
//   student: {
//     id: number;
//     firstName: string;
//     lastName: string;
//   };
//   group: {
//     id: number;
//     name: string;
//   };
//   status: PatientStatus;
//   from: Date;
//   to: Date;

//   constructor({
//     appointment,
//     languageKey,
//   }: {
//     appointment: Appointment;
//     languageKey: string;
//   }) {
//     this.id = appointment.id;
//     this.group = {
//       id: appointment.student.group.id,
//       name: appointment.student.group.name[languageKey],
//     };

//     this.student = {
//       id: appointment.student.id,
//       firstName: appointment.student.firstName,
//       lastName: appointment.student.lastName,
//     };
//     this.from = appointment.from;
//     this.to = appointment.to;
//   }
//   toObject(): IGetByCriteriaAppointmentsMobileSupervisorResponse {
//     return {
//       id: this.id,
//       student: this.student,
//       group: this.group,
//       status: this.status,
//       from: this.from,
//       to: this.to,
//     };
//   }
// }
