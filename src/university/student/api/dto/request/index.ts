import { GetByCriteria } from 'package/pagination/dto';
import { Doctor } from 'src/account/doctor/data/doctor.schema';

export class CreateStudentRequest {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  yearId?: number;
  groupId?: number;
  birthDate?: string;
  phoneNumber?: string;
  doctor?: Doctor;
}

export class UpdateStudentRequest {
  id?: number;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  year?: number;
  group?: number;
  birthDate?: string;
  phoneNumber?: string;
  doctorId?: number;
}

export class GetStudentsQuery extends GetByCriteria {
  search?: string;
}
