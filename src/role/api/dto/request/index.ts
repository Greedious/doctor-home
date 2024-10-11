import { language } from 'package/utils/language/language';
import { Privilege } from 'src/privilege/data/privilege.schema';

export class CreateRoleRequest {
  name: language;
  privileges: number[] | Privilege[];
}

export class UpdateRoleRequest {
  id?: number;
  name?: language;
  privileges?: number[] | Privilege[];
}

export class UpdateRole {
  name?: language;
  privileges?: Privilege[];
}
