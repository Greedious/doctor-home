import { Types } from 'src/account/user/data/user.schema';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';

export class IUser {
  id: number;
  isActive: boolean;
  phoneNumber?: string;
  type: Types[];
  username?: string;
  role: Types[];
  privileges: privilegeKeys[];
  doctor?: number;
  vendor?: number;
  operator?: number;
  student?: number;
  teacher?: number;
  supervisor?: number;
}
