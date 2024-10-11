// type filterObjects = {
//   fullName?: string;
//   id?: number;
// };

import { User } from '../data/user.schema';

export class UserFilterObject {
  filter: Partial<User>;

  constructor() {
    this.filter = {};
  }

  getId(id: number) {
    this.filter['id'] = id;
    return this;
  }

  getIsActive(isActive: string) {
    if (isActive === undefined) return this;
    this.filter.isActive = isActive == 'true';
    return this;
  }

  build() {
    return this.filter;
  }
}
