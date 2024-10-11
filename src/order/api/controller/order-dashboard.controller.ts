import {
  Body,
  Delete,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { OrderDashboardService } from 'src/order/service/order-dashboard.service';
import { GetAllOrder, UpdateOrderRequest } from '../dto/request';
import { OrderValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { OrderFilterObject } from 'src/order/helper/order-filter';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { OrderStatus } from 'package/utils/enums';
import { paginationParser } from 'package/pagination/pagination';
import { GetByCriteriaOrderResponse } from '../dto/response/get-all-order.dto';
import { GetByIdOrderDashboardResponse } from '../dto/response/get-by-id-dashboard-order';

@AuthenticatedController({ controller: 'orders' })
export class OrderDashboardController {
  constructor(
    private readonly orderService: OrderDashboardService,
    private readonly orderValidation: OrderValidation,
  ) {}

  @Get('metadata')
  async metadata() {
    return await this.orderService.metadata();
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    role: [Types.ADMIN, Types.SUPER_ADMIN],
    privilege: [privilegeKeys.updateOrder],
  })
  @UseInterceptors(TransactionInterceptor)
  async update(
    @Body() body: UpdateOrderRequest,
    @Param() params: Params,
    @TransactionParam() transaction: Transaction,
  ) {
    this.orderValidation.update({ body, params });
    const order = await this.orderService.findOneById(params.id);
    if (
      order.status !== OrderStatus.CANCELED &&
      body.status === OrderStatus.CANCELED
    ) {
      await this.orderService.updateProductQuantity(
        { order, inc: true },
        transaction,
      );
    } else if (
      order.status === OrderStatus.CANCELED &&
      body.status !== OrderStatus.CANCELED
    ) {
      await this.orderService.updateProductQuantity(
        { order, inc: false },
        transaction,
      );
    }

    if (body.status === OrderStatus.DELIVERED) {
      body.reviewPopup = true;
    }
    await this.orderService.update(body, params, transaction);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/',
    role: [Types.ADMIN, Types.SUPER_ADMIN],
    privilege: [privilegeKeys.viewOrder],
  })
  async getAll(@Headers() header: IHeaders, @Query() query: GetAllOrder) {
    this.orderValidation.getAll({ query });
    const { pagination } = paginationParser(query);
    const filter = new OrderFilterObject().getStatus(query.status).build();
    const data = await this.orderService.findAll(filter, pagination);
    return {
      count: data.count,
      rows: data.rows.map((order) =>
        new GetByCriteriaOrderResponse({
          order,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.ADMIN, Types.SUPER_ADMIN],
    privilege: [privilegeKeys.viewOrder],
  })
  async getOneOrder(@Headers() header: IHeaders, @Param() params: Params) {
    this.orderValidation.paramsId({ params });
    const order = await this.orderService.findOneById(+params.id);
    return new GetByIdOrderDashboardResponse({
      order: order,
      languageKey: header.languageKey,
    });
  }

  @Delete('/:id')
  async delete(@Param() params: Params) {
    this.orderValidation.paramsId({ params });
    await this.orderService.findOneById(params.id);
    await this.orderService.delete(params);
    return;
  }
}
