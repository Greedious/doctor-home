import { pick } from 'lodash';
import { Teacher } from 'src/university/teacher/data/teacher.schema';

export class GetTeachersResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  specialty: string;
  birthDate?: string;

  constructor(teacher: Teacher) {
    Object.assign(
      this,
      pick(teacher, [
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
