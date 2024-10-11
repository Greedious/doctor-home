import { GetByCriteria } from 'package/pagination/dto';
import { User } from 'src/account/user/data/user.schema';
import { Role } from 'src/role/data/role.schema';
export class CreateVendorRequest {
  fullName: string;
  username: string;
  password: string;
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

export class GetAllVendorQuery extends GetByCriteria {
  isActive: string;
  fullName: string;
}

export class UpdateVendor {
  isActive: boolean;
}

export class EditProfileVendorUser {
  id: number;
  fullName: string;
}

export class EditProfileVendor {
  id: number;
  fullName: string;
}
