import { Role } from 'src/role/data/role.schema';

export class CreateDoctorUser {
  phoneNumber: string;
  role: Role;
}
export class EditProfileDoctorUser {
  id: number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export class EditProfileDoctor {
  id: number;
  firstName: string;
  lastName: string;
}
