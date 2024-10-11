import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { AdsDashboardService } from 'src/ads/service/ads-dashboard.service';
import { GetAllAds } from '../dto/request';
import { AdsValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteriaAdsMobileResponse } from '../dto/response/get-all-ads-mobile.dto';
import { GetByIdAdsMobileResponse } from '../dto/response/get-by-id-ads-mobile.dto';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';

@Controller('/mobile/ads')
export class AdsMobileController {
  constructor(
    private readonly adsService: AdsDashboardService,
    private readonly adsValidation: AdsValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.adsValidation.paramsId({ params });
    const ads = await this.adsService.findOne(params);
    return new GetByIdAdsMobileResponse({ ads, languageKey }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
  })
  async getAll(@Headers() header: IHeaders, @Query() query: GetAllAds) {
    this.adsValidation.getAll({ query });
    const ads = await this.adsService.findAll();
    return {
      rows: ads.map((ad) =>
        new GetByCriteriaAdsMobileResponse({
          ads: ad,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }
}
