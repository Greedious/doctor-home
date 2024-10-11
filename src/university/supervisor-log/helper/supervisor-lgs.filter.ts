import { Op, WhereOptions } from 'sequelize';
import { SupervisorLog } from '../data/supervisor-logs.schema';

export class SupervisorLogFilter {
  filter: WhereOptions<SupervisorLog>;

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
    const result: WhereOptions<SupervisorLog> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
