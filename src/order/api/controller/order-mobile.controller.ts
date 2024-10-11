import { Body, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { OrderMobileService } from 'src/order/service/order-mobile.service';
import { OrderValidation } from '../validation';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { paginationParser } from 'package/pagination/pagination';
import { OrderFilterObject } from 'src/order/helper/order-filter';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { CreateOrderRequest, GetAllOrder } from '../dto/request';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { Params } from 'package/component/params/params';
import { GetByIdOrderMobileResponse } from '../dto/response/get-by-id-mobile-order.dto';
import { GetByCriteriaOrderMobileResponse } from '../dto/response/get-all-order-mobile.dto';

@AuthenticatedController({ controller: 'mobile/orders' })
export class OrderMobileController {
  constructor(
    private readonly orderService: OrderMobileService,
    private readonly orderValidation: OrderValidation,
  ) {}

  @Get('metadata')
  async metadata() {
    return await this.orderService.metadata();
  }

  @AuthorizedApi({ url: '/', api: Api.POST, role: [Types.DOCTOR] })
  @UseInterceptors(TransactionInterceptor)
  async create(
    @TransactionParam() transaction: Transaction,
    @Body() body: CreateOrderRequest,
    @User() user: IUser,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.orderValidation.create({ body });
    const { addressId, freeDeliverAreaId } =
      await this.orderService.validateAddress(
        user,
        body.address,
        body.deliverOption,
      );

    const { totalPrice, totalQuantity, resultProducts } =
      await this.orderService.checkProduct(body.products, transaction);

    let discount = 0;
    let discountId = null;
    if (body.coupon) {
      const obj = await this.orderService.checkCoupon(
        body.coupon,
        resultProducts,
      );
      discountId = obj.discountId;
      discount = totalPrice - obj.totalPriceWithDiscount;
    }

    const order = await this.orderService.create(
      {
        addressId,
        freeDeliverAreaId,
        totalPrice,
        discount,
        discountId,
        totalQuantity,
        userId: user.id,
        deliverOption: body.deliverOption,
        products: resultProducts.map((product) => {
          return {
            skuId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: product.quantity,
          };
        }),
      },
      transaction,
    );
    return { id: order.id };
  }

  @AuthorizedApi({ url: '/:id', api: Api.GET, role: [Types.DOCTOR] })
  async findOne(
    @Param() params: Params,
    @Headers() { languageKey }: IHeaders,
    @User() user: IUser,
  ) {
    this.orderValidation.paramsId({ params });
    const order = await this.orderService.findOne(user, params);
    return new GetByIdOrderMobileResponse({ order, languageKey }).toObject();
  }

  @AuthorizedApi({ url: '/', api: Api.GET, role: [Types.DOCTOR] })
  async findAll(
    @Query() query: GetAllOrder,
    @Headers() { languageKey }: IHeaders,
    @User() user: IUser,
  ) {
    this.orderValidation.getAllMobile({ query });
    const { pagination } = paginationParser(query);
    const filter = new OrderFilterObject()
      .getUser(user.id)
      .getStatus(query.status)
      .build();
    const order = await this.orderService.findAll(filter, pagination);
    return {
      count: order.count,
      rows: order.rows.map((order) =>
        new GetByCriteriaOrderMobileResponse({
          order,
          languageKey,
        }).toObject(),
      ),
    };
  }
}
