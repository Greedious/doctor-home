import { Op, WhereOptions } from 'sequelize';
import { Order } from '../data/order.schema';
import { OrderStatus } from 'package/utils/enums';

// type filterObjects = {
//   fullName?: string;
//   id?: number;
// };

export class OrderFilterObject {
  filter: WhereOptions<Order>;

  constructor() {
    this.filter = {};
  }

  getId(id: number) {
    this.filter['id'] = id;
    return this;
  }

  getStatus(status: OrderStatus) {
    if (!status) return this;
    this.filter['status'] = status;
    return this;
  }

  getUser(userId: number) {
    this.filter['userId'] = userId;
    return this;
  }

  build() {
    return this.filter;
  }
}
