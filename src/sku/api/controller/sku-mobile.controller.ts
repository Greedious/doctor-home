import { Get, Param, Query } from '@nestjs/common';
import { SkuMobileService } from 'src/sku/service/sku-mobile.service';
import { SkuValidation } from '../validation';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetAllSku, SkuParam } from '../dto/request';
import { ProductSkuFilterObject } from 'src/sku/helper/product-sku-filter';
import { SkuProduct } from 'src/sku/data/sku.schema';
import { WhereOptions } from 'sequelize';
import { GetByCriteriaSkuMobileResponse } from '../dto/response/get-all-sku-mobile.dto';

@AuthenticatedController({ controller: '/mobile/skus' })
export class SkuMobileController {
  constructor(
    private readonly skuService: SkuMobileService,
    private readonly skuValidation: SkuValidation,
  ) {}

  @Get('/:productId')
  async getProperties(
    @Param() params: SkuParam,
    @Headers() { languageKey }: IHeaders,
    @Query() query: GetAllSku,
  ) {
    this.skuValidation.getAll({ params, query });
    const skuProductFilter: WhereOptions<SkuProduct>[] = [];
    for (const key in query) {
      const filter = new ProductSkuFilterObject()
        .getKey(key)
        .getValue(query[key])
        .build();
      skuProductFilter.push(filter);
    }
    const sku = await this.skuService.findOne(params, skuProductFilter);

    return new GetByCriteriaSkuMobileResponse({ sku, languageKey });
  }

  // @Get('/')
  // async findAll(@Query() query, @Headers() { languageKey }: IHeaders) {
  //   this.skuValidation.getAllMobile({ query });
  //   const { criteria } = paginationParser(query);
  //   const filter = new SkuFilterObject().build();
  //   const sku = await this.skuService.findAll(filter);
  //   return {
  //     rows: sku.map((sku) =>
  //       new GetByCriteriaSkuMobileResponse({
  //         sku,
  //         languageKey,
  //       }).toObject(),
  //     ),
  //   };
  // }
}
