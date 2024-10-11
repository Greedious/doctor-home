import { language } from 'package/utils/language/language';
import { Role } from 'src/role/data/role.schema';

export class GetByCriteriaRoleResponse {
  id: number;
  role: string;
  name: language;
  // privileges: {
  //   id: number;
  //   key: string;
  //   name: string;
  //   description: string;
  // }[];

  constructor({ role, languageKey }: { role: Role; languageKey: string }) {
    this.id = role.id;
    this.name = role.name;
    // this.privileges = role.privileges.map((privilege) => {
    //   return {
    //     id: privilege.id,
    //     key: privilege.key,
    //     name: privilege.name[languageKey || 'ar'],
    //     description: privilege.description[languageKey || 'ar'],
    //   };
    // });
  }

  toObject(): {
    id: number;
    role: string;
    name: language;
  } {
    return {
      id: this.id,
      role: this.role,
      name: this.name,
    };
  }
}
