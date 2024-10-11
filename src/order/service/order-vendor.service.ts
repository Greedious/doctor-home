import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { OrderError } from './order-error.service';
import { Order } from 'src/order/data/order.schema';
import { OrderRepository } from '../data/order.repository';
import { WhereOptions } from 'sequelize';
import { Params } from 'package/component/params/params';
import { Image } from 'src/image/data/image.schema';

@Injectable()
export class OrderVendorService {
  constructor(
    private orderRepository: OrderRepository,
    private orderError: OrderError,
  ) {}

  async findOneById(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      error: this.orderError.notFound(),
    });
    return order;
  }

  async findOne({ id }: Params) {
    // const order = await this.orderRepository.findOne({
    //   where: { id, level: 0 },
    //   error: this.orderError.notFound(),
    //   include: [
    //     {
    //       model: Order,
    //       as: 'suborders',
    //     },
    //   ],
    // });
    // if (!order.suborders.length) {
    //   throw new HttpException(this.orderError.notFound(), HttpStatus.NOT_FOUND);
    // }
    // return order;
  }

  async findAll(filter: WhereOptions<Order>) {
    const orders = await this.orderRepository.findAll({
      where: filter,
      include: [
        {
          model: Order,
          as: 'suborders',
        },
        Image,
      ],
    });

    return orders;
  }
}
