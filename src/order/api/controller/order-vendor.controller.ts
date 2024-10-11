import { Get, Param, Query } from '@nestjs/common';
import { OrderValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { OrderFilterObject } from 'src/order/helper/order-filter';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { OrderVendorService } from 'src/order/service/order-vendor.service';
import { GetByCriteriaOrderVendorResponse } from '../dto/response/get-all-order-vendor.dto';
import { filterOrder } from 'src/order/helper/order-with-suborder';
import { paginationParser } from 'package/pagination/pagination';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';

@AuthenticatedController({ controller: '/vendor/orders' })
export class OrderVendorController {
  constructor(
    private readonly orderService: OrderVendorService,
    private readonly orderValidation: OrderValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.VENDOR],
  })
  async findOne(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
    this.orderValidation.paramsId({ params });
    const order = await this.orderService.findOne(params);

    // return {
    //   row: new GetByCriteriaOrderVendorResponse({
    //     order,
    //     languageKey,
    //   }).toObject(),
    // };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/',
    role: [Types.VENDOR],
  })
  async findAll(@Query() query, @Headers() { languageKey }: IHeaders) {
    this.orderValidation.getAllMobile({ query });
    const { criteria } = paginationParser(query);
    const filter = new OrderFilterObject().build();
    const order = await this.orderService.findAll(filter);
    // const filteredOrders = filterOrder(order);
    // return {
    //   rows: filteredOrders.map((order) =>
    //     new GetByCriteriaOrderVendorResponse({
    //       order,
    //       languageKey,
    //     }).toObject(),
    //   ),
    // };
  }
}
