import { Op, WhereOptions } from 'sequelize';
import { Vendor } from '../data/vendor.schema';

// type filterObjects = {
//   fullName?: string;
//   id?: number;
// };

export class VendorFilterObject {
  filter: WhereOptions<Vendor>;

  constructor() {
    this.filter = {};
  }

  getId(id: number) {
    this.filter['id'] = id;
    return this;
  }

  getFullNameLike(fullName: string) {
    if (!fullName) return this;
    this.filter['fullName'] = { [Op.like]: `%${fullName}%` };
    return this;
  }

  build() {
    return this.filter;
  }
}
