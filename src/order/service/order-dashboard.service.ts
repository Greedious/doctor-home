import { Injectable } from '@nestjs/common';
import { UpdateOrderRequest } from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { OrderError } from './order-error.service';
import { Order, OrderedProduct } from 'src/order/data/order.schema';
import {
  OrderRepository,
  OrderedProductRepository,
} from '../data/order.repository';
import { Transaction, WhereOptions } from 'sequelize';
import { Image } from 'src/image/data/image.schema';
import { SkuService } from 'src/sku/service/sku.service';
import { User } from 'src/account/user/data/user.schema';
import { Doctor } from 'src/account/doctor/data/doctor.schema';
import { OrderStatus } from 'package/utils/enums';
import { Address } from 'src/address/data/address.schema';
import { DeliveryArea } from 'src/delivery-area/data/delivery-area.schema';

@Injectable()
export class OrderDashboardService {
  constructor(
    private orderRepository: OrderRepository,
    private skuService: SkuService,
    private orderedProductRepository: OrderedProductRepository,
    private orderError: OrderError,
  ) {}

  async findOneById(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      error: this.orderError.notFound(),
      include: [OrderedProduct, Address, DeliveryArea],
    });
    return order;
  }

  async findOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      error: this.orderError.notFound(),
    });
    return order;
  }

  async findAll(
    filter: WhereOptions<Order>,
    { skip, limit }: { skip: number; limit: number },
  ) {
    const orders = await this.orderRepository.findAndCount({
      where: filter,
      options: { offset: skip, limit },
      include: [{ model: User, include: [Doctor] }],
    });

    return orders;
  }

  async delete({ id }: Params) {
    await this.orderRepository.delete({
      where: { id },
    });
    return;
  }

  async update(
    body: UpdateOrderRequest,
    { id }: Params,
    transaction: Transaction,
  ) {
    await this.orderRepository.update({
      where: { id },
      update: body,
      transaction,
    });
  }

  async updateProductQuantity(
    { order, inc }: { order: Order; inc: boolean },
    transaction: Transaction,
  ) {
    const skus = order.orderedProducts.map((product) => {
      return {
        id: product.id,
        quantity: product.quantity,
      };
    });
    await this.skuService.updateQuantity({ products: skus, inc }, transaction);
  }

  async metadata() {
    return { orderStatuses: OrderStatus, errors: this.orderError };
  }
}
