import { language } from 'package/utils/language/language';
import { UniversityOperator } from '../../../../operator/data/operator.schema';

export class GetByCriteriaUniversityOperatorResponse {
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
    universityOperator,
    languageKey,
  }: {
    universityOperator: UniversityOperator;
    languageKey: string;
  }) {
    this.id = universityOperator.user.id;
    this.username = universityOperator.user.username;
    this.isActive = universityOperator.user.isActive;
    this.type = universityOperator.user.type;
    this.fullName = universityOperator.fullName;
    this.role = {
      id: universityOperator.user.role.id,
      name: universityOperator.user.role.name,
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
