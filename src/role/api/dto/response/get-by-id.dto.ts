import { language } from 'package/utils/language/language';
import {
  GetAllPrivilegeDashboardResponse,
  IAllPrivilegesDashboardResponse,
} from 'src/privilege/api/dto/response/get-all.dto';
import { Role } from 'src/role/data/role.schema';

export interface IGetByIdRoleResponse {
  id: number;
  role: string;
  name: language;
  privileges: IAllPrivilegesDashboardResponse[];
}
export class GetByIdRoleResponse {
  id: number;
  role: string;
  name: language;
  privileges: IAllPrivilegesDashboardResponse[];

  constructor({ role, languageKey }: { role: Role; languageKey: string }) {
    this.id = role.id;
    this.name = role.name;
    this.privileges = role.privileges.map((privilege) =>
      new GetAllPrivilegeDashboardResponse({
        privilege,
        languageKey,
      }).toObject(),
    );
  }

  toObject(): IGetByIdRoleResponse {
    return {
      id: this.id,
      role: this.role,
      name: this.name,
      privileges: this.privileges,
    };
  }
}
