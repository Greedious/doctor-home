import { Op, WhereOptions } from 'sequelize';
import { Appointment } from '../data/appointment.schema';
import * as moment from 'moment-timezone';

export class AppointmentFilterObject {
  filter: WhereOptions<Appointment>;

  constructor() {
    this.filter = {
      [Op.or]: [],
      [Op.and]: [],
    };
  }

  pastOrCurrent(past: boolean) {
    if (past === undefined) return this;
    if (past == true) {
      this.filter[Op.and].push({
        from: {
          [Op.lt]: new Date(),
        },
      });
      return this;
    }
    this.filter[Op.and].push({
      from: {
        [Op.gte]: new Date(),
      },
    });
    return this;
  }

  sameDay(date: Date) {
    if (!date) return this;

    const targetDate = moment.tz(date.toString(), 'YYYY-MM-DD', 'UTC');
    const startOfDay = targetDate.startOf('day').toDate();
    const endOfDay = targetDate.endOf('day').toDate();

    this.filter[Op.and].push({
      from: {
        [Op.between]: [startOfDay, endOfDay],
      },
    });
    return this;
  }

  getStudent(studentId: number) {
    if (!studentId) return this;
    this.filter[Op.and].push({
      studentId,
    });
    return this;
  }

  getSubjects(subjects: number[]) {
    if (!subjects.length) return this;
    this.filter[Op.and].push({
      subjectId: {
        [Op.in]: subjects,
      },
    });
    return this;
  }

  build() {
    const result: WhereOptions<Appointment> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
