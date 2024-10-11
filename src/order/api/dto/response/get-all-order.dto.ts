import { Order } from 'src/order/data/order.schema';
export interface OrderUser {
  id: number;
  name: string;
}
export class GetByCriteriaOrderResponse {
  id: number;
  status: string;
  user: OrderUser;
  date: Date;
  deliverOption: string;
  constructor({ order, languageKey }: { order: Order; languageKey: string }) {
    this.id = order.id;
    this.status = order.status;
    this.date = order.createdAt;
    this.deliverOption = order.deliverOption;
    this.user = {
      id: order.user.id,
      name: order.user.doctor.firstName + ' ' + order.user.doctor.lastName,
    };
  }

  toObject(): {
    id: number;
    status: string;
    user: OrderUser;
    date: Date;
    deliverOption: string;
  } {
    return {
      id: this.id,
      status: this.status,
      user: this.user,
      date: this.date,
      deliverOption: this.deliverOption,
    };
  }
}
