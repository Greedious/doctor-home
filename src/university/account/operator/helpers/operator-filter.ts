import { Op, WhereOptions } from 'sequelize';
import { UniversityOperator } from '../data/operator.schema';

// type filterObjects = {
//   fullName?: string;
//   id?: number;
// };

export class UniversityOperatorFilterObject {
  filter: WhereOptions<UniversityOperator>;

  constructor() {
    this.filter = {};
  }

  getId(id: number) {
    this.filter['id'] = id;
    return this;
  }

  getFullNameLike(fullName: string) {
    if (!fullName) return this;
    this.filter['fullName'] = { [Op.like]: `%${fullName}%` };
    return this;
  }

  build() {
    return this.filter;
  }
}
