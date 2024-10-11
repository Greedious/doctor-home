import { Op, WhereOptions } from 'sequelize';
import { PatientReport } from '../data/patient-report.schema';

export class PatientReportFilterObject {
  filter: WhereOptions<PatientReport>;

  constructor() {
    this.filter = {
      [Op.or]: [],
      [Op.and]: [],
    };
  }

  search(search?: string) {
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

  getStudent(studentId?: number) {
    if (!studentId) return this;
    this.filter[Op.and].push({
      studentId,
    });
    return this;
  }

  getSubjects(subjectIds: number[]) {
    if (!subjectIds.length) {
      return this;
    }
    this.filter[Op.and].push({
      subjectId: {
        [Op.in]: subjectIds,
      },
    });
    return this;
  }
  build() {
    const result: WhereOptions<PatientReport> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
