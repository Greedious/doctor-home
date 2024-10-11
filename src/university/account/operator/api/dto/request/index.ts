import { GetByCriteria } from 'package/pagination/dto';
import { User } from 'src/account/user/data/user.schema';
import { Role } from 'src/role/data/role.schema';
export class CreateUniversityOperatorRequest {
  fullName: string;
  username: string;
  password: string;
  role: number;
}
export class CreateUniversityOperator {
  fullName: string;
  user: User;
}
export class CreateUniversityOperatorUser {
  username: string;
  password: string;
  role: number;
}
export class CreateVendor {
  fullName: string;
  user: User;
}
export class CreateVendorUser {
  username: string;
  password: string;
  role: number;
}

export class GetAllUniversityOperatorQuery extends GetByCriteria {
  isActive: string;
  fullName: string;
}

export class UpdateUniversityOperator {
  isActive: boolean;
}

export class EditProfileUniversityOperatorUser {
  id: number;
  fullName: string;
}

export class EditProfileUniversityOperator {
  id: number;
  fullName: string;
}
