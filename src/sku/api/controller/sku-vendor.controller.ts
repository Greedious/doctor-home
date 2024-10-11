import { Body, Param, Query } from '@nestjs/common';
import { SkuVendorService } from 'src/sku/service/sku-vendor.service';
import { CreateSkuRequest, GetAllSku, UpdateSkuRequest } from '../dto/request';
import { SkuValidation } from '../validation';

import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';

@AuthenticatedController({ controller: 'skus' })
export class SkuVendorController {
  constructor(
    private readonly skuService: SkuVendorService,
    private readonly skuValidation: SkuValidation,
  ) {}

  // @AuthorizedApi({
  //   api: Api.POST,
  //   url: '',
  //   role: [Types.VENDOR],
  // })
  // async create(@Body() body: CreateSkuRequest, @User() user: IUser) {
  //   this.skuValidation.create({ body });
  //   const subcategory = await this.skuService.validateSubcategory(
  //     body.subcategory,
  //   );
  //   return await this.skuService.create({ ...body, subcategory }, user);
  // }

  // @AuthorizedApi({
  //   api: Api.PATCH,
  //   url: '',
  //   role: [Types.VENDOR],
  // })
  // async update(@Body() body: UpdateSkuRequest, @Param() params: Params) {
  //   this.skuValidation.update({ body, params });
  //   const sku = await this.skuService.findOneById(params.id);
  //   if (body.subcategory !== sku.subcategoryId) {
  //     const subcategory = await this.skuService.validateSubcategory(
  //       body.subcategory,
  //     );
  //     body.category = subcategory.parentId;
  //   }
  //   return await this.skuService.update(
  //     {
  //       ...body,
  //       mainPrice: body.price,
  //       subcategoryId: body.subcategory,
  //       categoryId: body.category,
  //       imageId: body.image,
  //     },
  //     params,
  //   );
  // }

  // @AuthorizedApi({
  //   api: Api.GET,
  //   url: '',
  //   role: [Types.VENDOR],
  // })
  // async getAll(@Headers() header: IHeaders, @Query() query: GetAllSku) {
  //   this.skuValidation.getAll({ query });
  //   const filter = new SkuFilterObject().getParent(query.parent).build();
  //   const skus = await this.skuService.findAll(filter);
  //   return {
  //     rows: skus.map((sku) =>
  //       new GetByCriteriaSkuResponse({
  //         sku,
  //         languageKey: header.languageKey,
  //       }).toObject(),
  //     ),
  //   };
  // }

  // @AuthorizedApi({
  //   api: Api.DELETE,
  //   url: '',
  //   role: [Types.VENDOR],
  // })
  // async delete(@Param() params: Params) {
  //   this.skuValidation.paramsId({ params });
  //   await this.skuService.findOneById(params.id);
  //   await this.skuService.delete(params);
  //   return;
  // }
}
