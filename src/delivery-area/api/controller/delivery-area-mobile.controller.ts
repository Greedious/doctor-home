import { Param, Query } from '@nestjs/common';
import { DeliveryAreaDashboardService } from 'src/delivery-area/service/delivery-area-dashboard.service';
import { DeliveryAreaValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteriaDeliveryAreaResponse } from '../dto/response/get-all-delivery-area.dto';
import { GetByIdMobileDeliveryAreaResponse } from '../dto/response/get-by-id-mobile-delivery-area.dto';
import { GetByCriteria } from 'package/pagination/dto';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { GetByCriteriaDeliveryAreaMobileResponse } from '../dto/response/get-all-delivery-area-mobile.dto';

@AuthenticatedController({ controller: '/mobile/delivery-areas' })
export class DeliveryAreaMobileController {
  constructor(
    private readonly deliveryAreaService: DeliveryAreaDashboardService,
    private readonly deliveryAreaValidation: DeliveryAreaValidation,
  ) {}

  @AuthorizedApi({ api: Api.GET, url: '/:id', role: [Types.DOCTOR] })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.deliveryAreaValidation.paramsId({ params });
    const deliveryArea = await this.deliveryAreaService.findOne(params);
    return new GetByIdMobileDeliveryAreaResponse({
      deliveryArea,
      languageKey,
    }).toObject();
  }

  @AuthorizedApi({ api: Api.GET, url: '/', role: [Types.DOCTOR] })
  async getAll(@Headers() header: IHeaders, @Query() query: GetByCriteria) {
    this.deliveryAreaValidation.getAll({ query });
    const deliveryArea = await this.deliveryAreaService.findAll();
    return {
      rows: deliveryArea.map((deliveryArea) =>
        new GetByCriteriaDeliveryAreaMobileResponse({
          deliveryArea,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }
}
