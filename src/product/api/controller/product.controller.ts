import { Body, Param, Query, UseInterceptors, UsePipes } from '@nestjs/common';
import { ProductDashboardService } from 'src/product/service/product-dashboard.service';
import {
  CreateProductRequest,
  GetAllProductQuery,
  UpdateProductRequest,
} from '../dto/request';
import { ProductValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteriaProductResponse } from '../dto/response/get-all-product.dto';
import { ProductFilterObject } from 'src/product/helper/product-filter';
import { User } from 'package/decorator/param/user.decorator';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { IUser } from 'src/shared/types/user';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { CurrentUser } from 'package/decorator/authorization/user.decorator';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { paginationParser } from 'package/pagination/pagination';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';
import { OrderService } from 'src/order/service/order.service';
import { GetByIdProductDashboardResponse } from '../dto/response/get-by-id-dashboard.dto';

@AuthenticatedController({ controller: 'products' })
export class ProductController {
  constructor(
    private readonly productService: ProductDashboardService,
    private readonly productValidation: ProductValidation,
  ) {}

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.createProduct],
  })
  async create(
    @Body() body: CreateProductRequest,
    @User() user: IUser,
    @TransactionParam() transaction: Transaction,
  ) {
    this.productValidation.create({ body });
    return await this.productService.create({ ...body }, user, transaction);
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.updateProduct],
  })
  async update(
    @Body() body: UpdateProductRequest,
    @Param() params: Params,
    @TransactionParam() transaction: Transaction,
    @CurrentUser() user: IUser,
  ) {
    this.productValidation.update({ body });
    this.productValidation.paramsId({ params });
    return await this.productService.update(
      body,
      { id: params.id },
      user,
      transaction,
    );
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.viewProduct],
  })
  async getAll(
    @Headers() header: IHeaders,
    @Query() query: GetAllProductQuery,
  ) {
    this.productValidation.getAll({ query });
    const { pagination } = paginationParser(query);
    const filter = new ProductFilterObject();

    const products = await this.productService.findAll(
      filter.build(),
      pagination,
    );
    return {
      count: products.count,
      rows: products.rows.map((product) =>
        new GetByCriteriaProductResponse({
          product,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.viewProduct],
  })
  async getOne(@Param() params: Params, @Headers() headers: IHeaders) {
    this.productValidation.paramsId({ params });
    const id = +params.id;

    const product = await this.productService.findOne(id);

    return new GetByIdProductDashboardResponse({
      product,
      languageKey: headers.languageKey,
    });
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.deleteProduct],
  })
  async delete(
    @Param() params: Params,
    @TransactionParam() transaction: Transaction,
  ) {
    this.productValidation.paramsId({ params });
    await this.productService.findOneById(params.id);
    const id = +params.id;
    await this.productService.clearOldVariantsAndSkus(id, transaction);
    await this.productService.delete(id, transaction);
    return;
  }
}
