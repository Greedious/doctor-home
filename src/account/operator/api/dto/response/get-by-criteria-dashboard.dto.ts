import { language } from 'package/utils/language/language';
import { Operator } from 'src/account/operator/data/operator.schema';

export class GetByCriteriaOperatorResponse {
  id: number;
  username: string;
  type: string;
  fullName: string;
  isActive: boolean;
  role: {
    id: number;
    name: language;
  };

  constructor({
    operator,
    languageKey,
  }: {
    operator: Operator;
    languageKey: string;
  }) {
    this.id = operator.user.id;
    this.username = operator.user.username;
    this.isActive = operator.user.isActive;
    this.type = operator.user.type;
    this.fullName = operator.fullName;
    this.role = {
      id: operator.user.role.id,
      name: operator.user.role.name,
    };
  }

  toObject(): {
    id: number;
    username: string;
    type: string;
    fullName: string;
    isActive: boolean;
    role: {
      id: number;
      name: language;
    };
  } {
    return {
      id: this.id,
      username: this.username,
      isActive: this.isActive,
      type: this.type,
      role: this.role,
      fullName: this.fullName,
    };
  }
}
