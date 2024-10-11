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
import { AdsDashboardService } from 'src/ads/service/ads-dashboard.service';
import { CreateAdsRequest, GetAllAds, UpdateAdsRequest } from '../dto/request';
import { AdsValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { GetByIdAdsDashboardResponse } from '../dto/response/get-by-id-ads-dashboard.dto';
import { GetByCriteriaAdsDashboardResponse } from '../dto/response/get-all-ads-dashboard.dto';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';

@AuthenticatedController({
  controller: 'ads',
})
export class AdsDashboardController {
  constructor(
    private readonly adsService: AdsDashboardService,
    private readonly adsValidation: AdsValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [privilegeKeys.createAd],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async create(@Body() body: CreateAdsRequest) {
    this.adsValidation.create({ body });
    return await this.adsService.create(body);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [privilegeKeys.updateAd],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async update(@Body() body: UpdateAdsRequest, @Param() params: Params) {
    this.adsValidation.update({ body, params });
    await this.adsService.findOneById(params.id);
    return await this.adsService.update(
      { ...body, imageId: body.image },
      params,
    );
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [privilegeKeys.viewAd],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.adsValidation.paramsId({ params });
    const ads = await this.adsService.findOne(params);
    return new GetByIdAdsDashboardResponse({ ads, languageKey }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [privilegeKeys.viewAd],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async getAll(@Headers() header: IHeaders, @Query() query: GetAllAds) {
    this.adsValidation.getAll({ query });
    const ads = await this.adsService.findAll();
    return {
      rows: ads.map((ad) =>
        new GetByCriteriaAdsDashboardResponse({
          ads: ad,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [privilegeKeys.deleteAd],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async delete(@Param() params: Params) {
    this.adsValidation.paramsId({ params });
    await this.adsService.findOneById(params.id);
    await this.adsService.delete(params);
    return;
  }
}
