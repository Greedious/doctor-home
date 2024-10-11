import { pick } from 'lodash';
import { language } from 'package/utils/language/language';
import { Student } from 'src/university/student/data/student.schema';

export interface IGetStudentsForSupervisorResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber?: string;
  birthDate?: string;
  year: {
    id: number;
    rank: number;
    name: language;
  };
  group: {
    id: number;
    name: language;
  };
}
export class GetStudentsForSupervisorResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  birthDate?: string;
  year: {
    id: number;
    rank: number;
    name: language;
  };
  group: {
    id: number;
    name: language;
  };

  constructor({
    student,
    languageKey,
  }: {
    student: Student;
    languageKey: string;
  }) {
    Object.assign(
      this,
      pick(student, [
        'id',
        'firstName',
        'lastName',
        'fatherName',
        'motherName',
        'phoneNumber',
        'birthDate',
      ]),
    );
    this.year = {
      id: student.year.id,
      rank: student.year.rank,
      name: student.year.name[languageKey],
    };
    this.group = {
      id: student.group.id,
      name: student.group.name[languageKey],
    };
    this.phoneNumber = student.doctor?.user?.phoneNumber || null;
  }

  toObject(): IGetStudentsForSupervisorResponse {
    const response = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fatherName: this.fatherName,
      motherName: this.motherName,
      phoneNumber: this.phoneNumber,
      birthDate: this.birthDate,
      year: this.year,
      group: this.group,
    };
    return response;
  }
}
