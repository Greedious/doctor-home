import { Op, WhereOptions } from 'sequelize';
import { Specialty } from '../data/specialty.schema';

export class SpecialtyFilter {
  filter: WhereOptions<Specialty>;

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
  getSearch(search: string) {
    if (!search) return this;
    this.filter[Op.or].push({
      firstName: {
        [Op.iLike]: `%${search}%`,
      },
    });
    this.filter[Op.or].push({
      lastName: {
        [Op.iLike]: `%${search}%`,
      },
    });
    return this;
  }

  build() {
    const result: WhereOptions<Specialty> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
