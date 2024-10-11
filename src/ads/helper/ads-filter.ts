import { Op, WhereOptions } from 'sequelize';
import { Ads } from '../data/ads.schema';

// type filterObjects = {
//   fullName?: string;
//   id?: number;
// };

export class AdsFilterObject {
  filter: WhereOptions<Ads>;

  constructor() {
    this.filter = {};
  }

  build() {
    return this.filter;
  }
}
