import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { DeliveryAreaDashboardService } from 'src/delivery-area/service/delivery-area-dashboard.service';
import { CreateDeliveryAreaRequest, UpdateDeliveryArea } from '../dto/request';
import { DeliveryAreaValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteriaDeliveryAreaResponse } from '../dto/response/get-all-delivery-area.dto';
import { GetByIdDeliveryAreaResponse } from '../dto/response/get-by-id-delivery-area.dto';
import { GetByCriteria } from 'package/pagination/dto';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';

@AuthenticatedController({ controller: 'delivery-areas' })
export class DeliveryAreaDashboardController {
  constructor(
    private readonly deliveryAreaService: DeliveryAreaDashboardService,
    private readonly deliveryAreaValidation: DeliveryAreaValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.createDeliveryArea],
  })
  async create(@Body() body: CreateDeliveryAreaRequest) {
    this.deliveryAreaValidation.create({ body });
    return await this.deliveryAreaService.create(body);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.updateDeliveryArea],
  })
  async update(@Body() body: UpdateDeliveryArea, @Param() params: Params) {
    this.deliveryAreaValidation.update({ body, params });
    await this.deliveryAreaService.findOneById(params.id);
    return await this.deliveryAreaService.update(body, params);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.viewDeliveryArea],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.deliveryAreaValidation.paramsId({ params });
    const deliveryArea = await this.deliveryAreaService.findOne(params);
    return new GetByIdDeliveryAreaResponse({
      deliveryArea,
      languageKey,
    }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.viewDeliveryArea],
  })
  async getAll(@Headers() header: IHeaders, @Query() query: GetByCriteria) {
    this.deliveryAreaValidation.getAll({ query });
    const deliveryArea = await this.deliveryAreaService.findAll();
    return {
      rows: deliveryArea.map((ad) =>
        new GetByCriteriaDeliveryAreaResponse({
          deliveryArea: ad,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '',
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.deleteDeliveryArea],
  })
  async delete(@Param() params: Params) {
    this.deliveryAreaValidation.paramsId({ params });
    await this.deliveryAreaService.findOneById(params.id);
    await this.deliveryAreaService.delete(params);
    return;
  }
}
