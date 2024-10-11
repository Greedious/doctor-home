import { pick } from 'lodash';
import { Teacher } from 'src/university/teacher/data/teacher.schema';

export interface IGetByIdTeacherResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  specialty: string;
  birthDate?: string;
  subjects: { id: number; name: string }[];
}
export class GetByIdTeacherResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  specialty: string;
  birthDate?: string;
  subjects: { id: number; name: string }[];

  constructor({
    teacher,
    languageKey,
  }: {
    teacher: Teacher;
    languageKey: string;
  }) {
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
    this.subjects = teacher.subjects.map((teacherSubject) => {
      return {
        id: teacherSubject.subject.id,
        name: teacherSubject.subject.name[languageKey],
      };
    });
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
      subjects: this.subjects,
    };
    return response;
  }
}
