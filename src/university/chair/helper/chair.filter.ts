import { Op, WhereOptions } from 'sequelize';
import { Chair } from '../data/chair.schema';

export class ChairFilter {
  filter: WhereOptions<Chair>;

  constructor() {
    this.filter = {
      [Op.or]: [],
      [Op.and]: [],
    };
  }
  getId(id: number) {
    this.filter[Op.and].push({ id });
    return this;
  }
  getSubjectId(subjectId: number) {
    if (!subjectId) return this;
    this.filter[subjectId] = subjectId;
    return this;
  }
  getSearch(search: string) {
    if (!search) return this;
    this.filter[Op.or].push({
      name: {
        [Op.iRegexp]: search,
      },
    });
    this.filter[Op.or].push({
      name: {
        [Op.iRegexp]: search,
      },
    });
    return this;
  }

  build() {
    const result: WhereOptions<Chair> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
