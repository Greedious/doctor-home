import { OrderStatus } from 'package/utils/enums';
import { Order, deliverOption } from 'src/order/data/order.schema';

class OrderUserResponse {
  id: number;
  username?: string;
  phoneNumber: string;
}
class OrderAddressResponse {
  id: number;
  title: string;
}
class OrderDeliveryAreaResponse {
  area: string;
  time: string;
}

interface IGetByIdOrderDashboardResponse {
  id: number;
  totalPrice: number;
  discount: number;
  totalQuantity: number;
  status: OrderStatus;
  deliverOption?: deliverOption;
  reviewPopup: boolean;
  user: OrderUserResponse;
  address?: OrderAddressResponse;
  freeDeliveryArea?: OrderDeliveryAreaResponse;
}

export class GetByIdOrderDashboardResponse {
  id: number;
  totalPrice: number;
  discount: number;
  totalQuantity: number;
  status: OrderStatus;
  deliverOption?: deliverOption;
  reviewPopup: boolean;
  user: OrderUserResponse;
  address?: OrderAddressResponse;
  freeDeliveryArea?: OrderDeliveryAreaResponse;

  constructor({ order, languageKey }: { order: Order; languageKey: string }) {
    this.id = order.id;
    this.totalPrice = order.totalPrice;
    this.discount = order.discount;
    this.status = order.status;
    this.deliverOption = order.deliverOption;
    this.reviewPopup = order.reviewPopup;
    this.user = order.user
      ? {
          id: order.userId,
          username: order.user.username,
          phoneNumber: order.user.phoneNumber,
        }
      : undefined;

    this.address = order.address
      ? {
          id: order.addressId,
          title: order.address.title,
        }
      : undefined;

    this.freeDeliveryArea = order.freeDeliverArea
      ? {
          area: order.freeDeliverArea.area[languageKey],
          time: order.freeDeliverArea.time[languageKey],
        }
      : undefined;
  }

  toObject(): IGetByIdOrderDashboardResponse {
    return {
      id: this.id,
      totalPrice: this.totalPrice,
      discount: this.discount,
      totalQuantity: this.totalQuantity,
      status: this.status,
      deliverOption: this.deliverOption,
      reviewPopup: this.reviewPopup,
      user: this.user,
      address: this.address,
      freeDeliveryArea: this.freeDeliveryArea,
    };
  }
}
