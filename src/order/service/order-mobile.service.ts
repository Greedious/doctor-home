import { Injectable } from '@nestjs/common';

import { OrderError } from './order-error.service';
import {
  Order,
  OrderedProduct,
  deliverOption,
} from 'src/order/data/order.schema';
import {
  OrderRepository,
  OrderedProductRepository,
} from '../data/order.repository';
import { Transaction, WhereOptions } from 'sequelize';
import { Params } from 'package/component/params/params';
import { CreateOrder } from '../api/dto/request';
import { ProductDto } from 'src/product/api/dto/request';
import { SkuService } from 'src/sku/service/sku.service';
import { DiscountService } from 'src/discount/service/discount.service';
import { AddressMobileService } from 'src/address/service/address-mobile.service';
import { IUser } from 'src/shared/types/user';
import { DeliveryAreaService } from 'src/delivery-area/service/delivery-area.service';
import { Sku } from 'src/sku/data/sku.schema';
import { Product } from 'src/product/data/product.schema';
import { Image } from 'src/image/data/image.schema';
import { OrderStatus } from 'package/utils/enums';
import { orderCriteria } from 'package/utils/methods';

@Injectable()
export class OrderMobileService {
  constructor(
    private orderRepository: OrderRepository,
    private orderedProductRepository: OrderedProductRepository,
    private skuService: SkuService,
    private discountService: DiscountService,
    private addressMobileService: AddressMobileService,
    private deliveryAreaService: DeliveryAreaService,
    private orderError: OrderError,
  ) {}

  async checkProduct(products: ProductDto[], transaction: Transaction) {
    return await this.skuService.checkProduct(products, transaction);
  }

  async checkCoupon(coupon: string, product: ProductDto[]) {
    return await this.discountService.checkCoupon(coupon, product);
  }

  async validateAddress(user: IUser, address: number, type: deliverOption) {
    let addressId = null;
    if (type === deliverOption.paid) {
      await this.addressMobileService.findOne(address, user.id);
      addressId = address;
    }

    let freeDeliverAreaId = null;
    if (type === deliverOption.free) {
      await this.deliveryAreaService.findOneById(address);
      freeDeliverAreaId = address;
    }

    return { addressId, freeDeliverAreaId };
  }

  async create(body: CreateOrder, transaction: Transaction) {
    const { products, ...orderBody } = body;
    const order = await this.orderRepository.create({
      doc: orderBody,
      options: { transaction },
    });

    const orderedProductsDoc = products.map((product) => {
      return {
        ...product,
        orderId: order.id,
      };
    });
    await this.orderedProductRepository.bulkCreate({
      doc: orderedProductsDoc,
      options: { transaction },
    });
    return order;
  }

  async findOneById(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      error: this.orderError.notFound(),
    });
    return order;
  }

  async findAll(
    filter: WhereOptions<Order>,
    { limit, skip }: { limit: number; skip: number },
  ) {
    const orders = await this.orderRepository.findAndCount({
      where: filter,
      options: { limit, offset: skip },
      include: [{ model: OrderedProduct, order: orderCriteria(), limit: 1 }],
    });

    return orders;
  }

  async findOne(user: IUser, { id }: Params) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
      include: [
        {
          model: OrderedProduct,
          include: [{ model: Sku, include: [{ model: Product }, Image] }],
        },
      ],
      error: this.orderError.notFound(),
    });

    return order;
  }

  async metadata() {
    return { orderStatuses: OrderStatus };
  }
}
