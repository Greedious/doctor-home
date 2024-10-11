import { Param, Query } from '@nestjs/common';
import { CategoryMobileService } from 'src/category/service/category-mobile.service';
import { CategoryValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByIdCategoryMobileResponse } from '../dto/response/get-by-id-mobile-category.dto';
import { paginationParser } from 'package/pagination/pagination';
import { CategoryFilterObject } from 'src/category/helper/category-filter';
import { GetByCriteriaCategoryMobileResponse } from '../dto/response/get-all-categories-mobile.dto';
import { filterCategory } from 'src/category/helper/category-with-subcategory';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';

@AuthenticatedController({ controller: '/mobile/categories' })
export class CategoryMobileController {
  constructor(
    private readonly categoryService: CategoryMobileService,
    private readonly categoryValidation: CategoryValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.DOCTOR],
  })
  async findOne(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
    this.categoryValidation.paramsId({ params });
    const category = await this.categoryService.findOne(params);

    return {
      row: new GetByIdCategoryMobileResponse({
        category,
        languageKey,
      }).toObject(),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/',
    role: [Types.DOCTOR],
  })
  async findAll(@Query() query, @Headers() { languageKey }: IHeaders) {
    this.categoryValidation.getAllMobile({ query });
    const { criteria } = paginationParser(query);
    const filter = new CategoryFilterObject().build();
    const category = await this.categoryService.findAll(filter);
    const filteredCategories = filterCategory(category);
    return {
      rows: filteredCategories.map((category) =>
        new GetByCriteriaCategoryMobileResponse({
          category,
          languageKey,
        }).toObject(),
      ),
    };
  }
}
