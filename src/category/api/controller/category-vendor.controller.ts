import { Get, Param, Query } from '@nestjs/common';
import { CategoryValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { CategoryFilterObject } from 'src/category/helper/category-filter';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { CategoryVendorService } from 'src/category/service/category-vendor.service';
import { GetByCriteriaCategoryVendorResponse } from '../dto/response/get-all-categories-vendor.dto';
import { filterCategory } from 'src/category/helper/category-with-subcategory';
import { paginationParser } from 'package/pagination/pagination';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';

@AuthenticatedController({ controller: '/vendor/categories' })
export class CategoryVendorController {
  constructor(
    private readonly categoryService: CategoryVendorService,
    private readonly categoryValidation: CategoryValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [privilegeKeys.viewCategory],
    role: [Types.VENDOR],
  })
  async findOne(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
    this.categoryValidation.paramsId({ params });
    const category = await this.categoryService.findOne(params);

    return {
      row: new GetByCriteriaCategoryVendorResponse({
        category,
        languageKey,
      }).toObject(),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/',
    privilege: [privilegeKeys.viewCategory],
    role: [Types.VENDOR],
  })
  async findAll(@Query() query, @Headers() { languageKey }: IHeaders) {
    this.categoryValidation.getAllMobile({ query });
    const { criteria } = paginationParser(query);
    const filter = new CategoryFilterObject().build();
    const category = await this.categoryService.findAll(filter);
    const filteredCategories = filterCategory(category);
    return {
      rows: filteredCategories.map((category) =>
        new GetByCriteriaCategoryVendorResponse({
          category,
          languageKey,
        }).toObject(),
      ),
    };
  }
}
