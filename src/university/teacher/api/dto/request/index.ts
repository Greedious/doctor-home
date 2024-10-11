import { GetByCriteria } from 'package/pagination/dto';

export class CreateTeacherRequest {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  specialtyId: number;
  birthDate?: string;
  phoneNumber?: string;
}

export class UpdateTeacherRequest {
  id?: number;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  specialtyId?: number;
  birthDate?: string;
  phoneNumber?: string;
}

export class AssignSubjectRequest {
  subjectId: number;
  groups: number[];
}
export class DeleteSubjectTeacherRequest {
  subjectId: number;
}
export class DeleteGroupTeacherRequest {
  subjectId: number;
  groupId: number;
}
export class AddGroupTeacherRequest {
  subjectId: number;
  groupId: number;
}

export class GetTeachersQuery extends GetByCriteria {
  search?: string;
}
