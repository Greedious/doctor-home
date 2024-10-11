import { GetByCriteria } from 'package/pagination/dto';
import { OrderStatus } from 'package/utils/enums';
import { language } from 'package/utils/language/language';
import { deliverOption } from 'src/order/data/order.schema';
import { ProductDto } from 'src/product/api/dto/request';

export class CreateSuborderRequest {
  name: language;
}
export class CreateOrderRequest {
  products: ProductDto[];
  coupon?: string;
  deliverOption: deliverOption;
  address: number;
}
export class UpdateOrderRequest {
  status: OrderStatus;
  reviewPopup?: boolean;
}

export class CreateOrder {
  products: {
    skuId: number;
    price: number;
    name: language;
    image: string;
    quantity: number;
  }[];
  totalPrice: number;
  discount: number;
  totalQuantity: number;
  discountId?: number | null;
  deliverOption: deliverOption;
  addressId: number;
  freeDeliverAreaId: number;
  userId: number;
}

export class GetAllOrder extends GetByCriteria {
  status?: OrderStatus;
}

export class GetAllOrderMobile {
  isFeatured: boolean;
}
