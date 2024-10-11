import { WhereOptions } from 'sequelize';
import { DeliveryArea } from '../data/delivery-area.schema';

// type filterObjects = {
//   fullName?: string;
//   id?: number;
// };

export class DeliveryAreaFilterObject {
  filter: WhereOptions<DeliveryArea>;

  constructor() {
    this.filter = {};
  }

  build() {
    return this.filter;
  }
}
