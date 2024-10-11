import { constructFileUrl } from 'package/utils/methods';
import { Order } from 'src/order/data/order.schema';

export class GetByCriteriaOrderMobileResponse {
  id: number;
  status: string;
  date: string;
  totalPrice: number;
  totalQuantity: number;
  name: string;
  image: string;

  constructor({ order, languageKey }: { order: Order; languageKey: string }) {
    this.id = order.id;
    this.date = order.createdAt;
    this.totalPrice = order.totalPrice;
    this.status = order.status;
    this.totalQuantity = order.totalQuantity;
    this.name = order.orderedProducts[0].name[languageKey || 'ar'];
    this.image = constructFileUrl(order.orderedProducts[0]?.image);
  }
  toObject(): {
    id: number;
    status: string;
    date: string;
    totalPrice: number;
    totalQuantity: number;
    name: string;
    image: string;
  } {
    return {
      id: this.id,
      status: this.status,
      date: this.date,
      totalPrice: this.totalPrice,
      totalQuantity: this.totalQuantity,
      name: this.name,
      image: this.image,
    };
  }
}
