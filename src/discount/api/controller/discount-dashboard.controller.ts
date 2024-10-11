import { Body, Param, ParseIntPipe, Query, UsePipes } from '@nestjs/common';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { DiscountDashboardService } from 'src/discount/service/discount-dashboard.service';
import {
  CreateDiscountRequest,
  GetAllDiscountsQuery,
  UpdateDiscount,
} from '../dto/request';
import { DiscountValidation } from '../validation';
import { paginationParser } from 'package/pagination/pagination';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { Params } from 'package/component/params/params';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';

@AuthenticatedController({
  controller: 'discounts',
})
export class DiscountDashboardController {
  constructor(
    private readonly discountDashboardService: DiscountDashboardService,
    private readonly discountValidation: DiscountValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.viewDiscount],
    url: '/',
  })
  async getAll(@Query() query: GetAllDiscountsQuery) {
    this.discountValidation.getAll({ query });
    const { pagination } = paginationParser(query);
    const response = await this.discountDashboardService.find(
      query,
      pagination,
    );
    return response;
  }

  @AuthorizedApi({
    api: Api.GET,
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.viewDiscount],
    url: '/:id',
  })
  async getOne(@Param() params: Params) {
    this.discountValidation.paramsId({ params });
    return await this.discountDashboardService.findOne(+params.id);
  }

  @AuthorizedApi({
    api: Api.POST,
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.createDiscount],
    url: '/',
  })
  async create(@Body() body: CreateDiscountRequest) {
    this.discountValidation.create({ body });
    const discount = await this.discountDashboardService.create({
      ...body,
      subcategoryId: body.subcategory,
    });
    return { id: discount.id };
  }

  @AuthorizedApi({
    api: Api.PATCH,
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.updateDiscount],
    url: '/:id',
  })
  @UsePipes(new ModifyPayloadPipe())
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDiscount,
  ) {
    body.id = id;
    this.discountValidation.patch({ body });
    await this.discountDashboardService.patch(body);
    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.deleteDiscount],
    url: '/:id',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.discountDashboardService.delete({ id });
    return;
  }
}
