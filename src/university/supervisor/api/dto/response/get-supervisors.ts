import { pick } from 'lodash';
import { Supervisor } from 'src/university/supervisor/data/supervisor.schema';

export class GetSupervisorsResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  specialty: string;
  birthDate?: string;

  constructor(supervisor: Supervisor) {
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
    };
    return response;
  }
}
