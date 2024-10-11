import { language } from 'package/utils/language/language';
import { Operator } from 'src/account/operator/data/operator.schema';
import { Privilege } from 'src/privilege/data/privilege.schema';

export interface IAllPrivilegesDashboardResponse {
  id: number;
  name: language;
  description: language;
  key: string;
}
export class GetAllPrivilegeDashboardResponse {
  id: number;
  name: language;
  description: language;
  key: string;

  constructor({
    privilege,
    languageKey,
  }: {
    privilege: Privilege;
    languageKey: string;
  }) {
    this.id = privilege.id;
    this.name = privilege.name;
    this.description = privilege.description;
    this.key = privilege.key;
  }

  toObject(): IAllPrivilegesDashboardResponse {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      key: this.key,
    };
  }
}
