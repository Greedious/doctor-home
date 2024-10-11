import { WhereOptions } from 'sequelize';
import { Question } from '../data/question.schema';

export class AdsFilterObject {
  filter: WhereOptions<Question>;

  constructor() {
    this.filter = {};
  }

  build() {
    return this.filter;
  }
}
