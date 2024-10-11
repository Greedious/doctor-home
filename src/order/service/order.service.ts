import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../data/order.repository';
import { OrderError } from './order-error.service';
import { Order } from '../data/order.schema';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/account/user/data/user.schema';
import { getMonthSpanDates, myDayjs } from 'package/utils/my-dayjs';
import { Op } from 'sequelize';
import { IYearChartObject } from '../api/dto/response';
import { generator } from 'package/utils/generator';
import { Doctor } from 'src/account/doctor/data/doctor.schema';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderError: OrderError,
  ) {}

  async mostOrderedProduct() {
    return await this.orderRepository.findMostOrderedProduct();
  }

  async top3Buyers() {
    const orders = await Order.findAll({
      where: {},
      group: ['user.id', 'user.doctor.id'],
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'totalPrice'],
      ],
      order: [[Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'DESC']],
      limit: 3,
      include: [{ model: User, include: [Doctor] }],
    });

    const users: { user: string; total: number }[] = [];
    for (const order of orders) {
      let name = '';
      if (order.user.doctor)
        name = order.user.doctor.firstName + ' ' + order.user.doctor.lastName;
      users.push({
        user: name,
        total: +order.totalPrice,
      });
    }

    return users;
  }

  async totalOrdersRevenue() {
    const totalCostSum = await this.orderRepository.sum('totalPrice', {});
    const discountSum = await this.orderRepository.sum('discount', {});
    return totalCostSum - discountSum;
  }

  async ordersOverTimeChart() {
    const currentYear = myDayjs().get('year');
    let fromYear = currentYear - 5;

    const response: IYearChartObject[] = [];

    while (fromYear <= currentYear) {
      const data: number[] = [];

      for (let monthCount = 0; monthCount < 12; monthCount++) {
        const [fromDate, toDate] = getMonthSpanDates(fromYear, monthCount + 1);

        const ordersCount = await this.orderRepository.count({
          where: {
            createdAt: {
              [Op.between]: [fromDate, toDate],
            },
          },
        });
        data.push(generator.randomInRange(200, 500)); //! replace with orders count
      }
      response.push({
        year: fromYear.toString(),
        data: [{ name: 'Orders Count', data }],
      });
      fromYear += 1;
    }
    return response;
  }
}
