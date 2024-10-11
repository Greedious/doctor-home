import { Op, WhereOptions } from 'sequelize';
import { Subject } from '../data/subject.schema';

export class SubjectFilterObject {
  filter: WhereOptions<Subject>;

  constructor() {
    this.filter = {
      [Op.or]: [],
      [Op.and]: [],
    };
  }
  getYear(yearId: number) {
    if (!yearId) return this;
    this.filter[Op.and].push({ yearId });
    return this;
  }

  getSeason(season: number) {
    if (!season) return this;
    this.filter[Op.and].push({ season });
    return this;
  }

  getId(id: number) {
    this.filter[Op.and].push({ id });
    return this;
  }
  getIsActive(isActive: boolean) {
    this.filter[Op.and].push({ isActive });
    return this;
  }
  getSearch(search: string) {
    if (!search) return this;
    this.filter[Op.or].push({
      'name.en': {
        [Op.iLike]: `%${search}%`,
      },
    });
    this.filter[Op.or].push({
      'name.ar': {
        [Op.iLike]: `%${search}%`,
      },
    });
    return this;
  }

  build() {
    const result: WhereOptions<Subject> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
