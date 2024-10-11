import { Op, WhereOptions } from 'sequelize';
import { GroupSchedule } from '../data/group.schema';
import moment from 'moment';

export class GroupScheduleFilterObject {
  filter: WhereOptions<GroupSchedule>;

  constructor() {
    this.filter = {
      [Op.or]: [],
      [Op.and]: [],
    };
  }

  sameDay(date: Date) {
    if (!date) return this;
    const targetDate = moment.tz(date.toString(), 'YYYY-MM-DD', 'UTC');
    this.filter[Op.and].push({
      dayOfWeek: targetDate.weekday(),
    });
    return this;
  }

  getGroup(groupId: number) {
    if (!groupId) return this;
    this.filter[Op.and].push({
      groupId,
    });
    return this;
  }

  build() {
    const result: WhereOptions<GroupSchedule> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
