import { pick } from 'lodash';
import { Supervisor } from 'src/university/supervisor/data/supervisor.schema';

export interface IGetByIdSupervisorResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  specialty: string;
  birthDate?: string;
  subject: { id: number; name: string };
}
export class GetByIdSupervisorResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  specialty: string;
  birthDate?: string;
  subject: { id: number; name: string };

  constructor({
    supervisor,
    languageKey,
  }: {
    supervisor: Supervisor;
    languageKey: string;
  }) {
    Object.assign(
      this,
      pick(supervisor, [
        'id',
        'firstName',
        'lastName',
        'fatherName',
        'motherName',
        'phoneNumber',
        'specialty',
        'birthDate',
      ]),
    );
    this.subject = {
      id: supervisor.subject.id,
      name: supervisor.subject.name[languageKey],
    };
  }

  toObject() {
    const response = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fatherName: this.fatherName,
      motherName: this.motherName,
      phoneNumber: this.phoneNumber,
      birthDate: this.birthDate,
      specialty: this.specialty,
      subject: this.subject,
    };
    return response;
  }
}
