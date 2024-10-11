import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { UserService } from 'src/account/user/service/user.service';
import { OrderService } from 'src/order/service/order.service';

@AuthenticatedController({ controller: 'statistics' })
export class StatisticsController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/most-ordered-product',
    role: [Types.ADMIN, Types.SUPER_ADMIN],
  })
  async getMostOrderedProduct() {
    return {
      product: await this.orderService.mostOrderedProduct(),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/total-products-revenue',
    role: [Types.ADMIN, Types.SUPER_ADMIN],
  })
  async getTotalProductsRevenue() {
    return {
      total: await this.orderService.totalOrdersRevenue(),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/active-users-count',
    role: [Types.ADMIN, Types.SUPER_ADMIN],
  })
  async getActiveUsersCount() {
    return {
      count: await this.userService.count({ isActive: true }),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/top-three-buyers',
    role: [Types.ADMIN, Types.SUPER_ADMIN],
  })
  async top3Buyers() {
    return {
      buyers: await this.orderService.top3Buyers(),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/orders-overtime-chart',
    role: [Types.ADMIN, Types.SUPER_ADMIN],
  })
  async ordersOvertimeChart() {
    return {
      data: await this.orderService.ordersOverTimeChart(),
    };
  }
}
