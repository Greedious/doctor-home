import { OrderStatus } from 'package/utils/enums';
import { constructFileUrl } from 'package/utils/methods';
import { Order } from 'src/order/data/order.schema';

export class GetByIdOrderMobileResponse {
  id: number;
  products: {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  totalPriceWithoutDiscount: number;
  discount: number;
  status: OrderStatus;
  taxes: number;
  delivery: number;
  constructor({ order, languageKey }: { order: Order; languageKey: string }) {
    this.id = order.id;
    this.totalPrice = order.totalPrice;
    this.totalPriceWithoutDiscount = order.totalPrice - order.discount;
    this.discount = order.discount;
    this.status = order.status;
    this.products = order.orderedProducts.map((product) => {
      return {
        id: product.skuId,
        name: product.sku?.product?.name[languageKey || 'ar'],
        quantity: product.quantity,
        price: product.price,
        image: constructFileUrl(product.sku.image.key),
      };
    });
    this.delivery = 0;
    this.taxes = 0;
  }
  toObject(): {
    id: number;
    products: {
      id: number;
      name: string;
      image: string;
      quantity: number;
      price: number;
    }[];
    totalPrice: number;
    totalPriceWithoutDiscount: number;
    taxes: number;
    delivery: number;
    discount: number;
    status: OrderStatus;
  } {
    return {
      id: this.id,
      products: this.products,
      status: this.status,
      totalPrice: this.totalPrice,
      totalPriceWithoutDiscount: this.totalPriceWithoutDiscount,
      taxes: this.taxes,
      delivery: this.delivery,
      discount: this.discount,
    };
  }
}
