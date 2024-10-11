import { Op, WhereOptions } from 'sequelize';
import { Sku, SkuProduct } from '../data/sku.schema';

// type filterObjects = {
//   fullName?: string;
//   id?: number;
// };

export class ProductSkuFilterObject {
  filter: WhereOptions<SkuProduct>;

  constructor() {
    this.filter = {};
  }

  getId(id: number) {
    this.filter['id'] = id;
    return this;
  }

  getKey(key: string) {
    this.filter['key'] = key;
    return this;
  }

  getValue(value: string) {
    this.filter['value'] = value;
    return this;
  }

  build() {
    return this.filter;
  }
}
