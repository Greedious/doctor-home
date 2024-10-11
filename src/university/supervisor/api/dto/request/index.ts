import { GetByCriteria } from 'package/pagination/dto';

export class CreateSupervisorRequest {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  specialtyId: number;
  birthDate?: string;
  phoneNumber?: string;
  subjectId?: number;
}

export class UpdateSupervisorRequest {
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
export class DeleteSubjectSupervisorRequest {
  subjectId: number;
}
export class DeleteGroupSupervisorRequest {
  subjectId: number;
  groupId: number;
}
export class AddGroupSupervisorRequest {
  subjectId: number;
  groupId: number;
}

export class GetSupervisorsQuery extends GetByCriteria {
  search?: string;
}
