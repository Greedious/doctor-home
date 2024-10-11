import { Op, WhereOptions } from 'sequelize';
import { Sku } from '../data/sku.schema';

// type filterObjects = {
//   fullName?: string;
//   id?: number;
// };

export class SkuFilterObject {
  filter: WhereOptions<Sku>;

  constructor() {
    this.filter = {};
  }

  getId(id: number) {
    this.filter['id'] = id;
    return this;
  }

  getParent(parent: number) {
    const parentId = parent ? parent : null;

    this.filter['parentId'] = parentId;
    return this;
  }

  build() {
    return this.filter;
  }
}
