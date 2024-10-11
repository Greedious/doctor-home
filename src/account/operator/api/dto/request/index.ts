import { GetByCriteria } from 'package/pagination/dto';
import { User } from 'src/account/user/data/user.schema';
import { Role } from 'src/role/data/role.schema';
export class CreateOperatorRequest {
  fullName: string;
  username: string;
  password: string;
  role: number;
}
export class CreateOperator {
  fullName: string;
  user: User;
}
export class CreateOperatorUser {
  username: string;
  password: string;
  role: number;
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

export class GetAllOperatorQuery extends GetByCriteria {
  isActive: string;
  fullName: string;
}

export class UpdateOperator {
  isActive: boolean;
}

export class EditProfileOperatorUser {
  id: number;
  fullName: string;
}

export class EditProfileOperator {
  id: number;
  fullName: string;
}
