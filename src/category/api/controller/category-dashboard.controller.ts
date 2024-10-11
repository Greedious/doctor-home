import { Body, Delete, Param, Query, UsePipes } from '@nestjs/common';
import { CategoryDashboardService } from 'src/category/service/category-dashboard.service';
import {
  CreateCategoryRequest,
  GetAllCategory,
  UpdateCategoryRequest,
} from '../dto/request';
import { CategoryValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteriaCategoryResponse } from '../dto/response/get-all-categories.dto';
import { CategoryFilterObject } from 'src/category/helper/category-filter';
import { Api } from 'package/utils/api-methods';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Types } from 'src/account/user/data/user.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { GetByIdCategoryDashboardResponse } from '../dto/response/get-by-id-category-dashboard';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';

@AuthenticatedController({ controller: 'categories' })
export class CategoryDashboardController {
  constructor(
    private readonly categoryService: CategoryDashboardService,
    private readonly categoryValidation: CategoryValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [privilegeKeys.createCategory],
  })
  async create(@Body() body: CreateCategoryRequest) {
    this.categoryValidation.create({ body });
    return await this.categoryService.create(body);
  }

  @AuthorizedApi({
    api: Api.POST,
    url: '/:id',
    privilege: [privilegeKeys.createCategory],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async createSubcategory(
    @Body() body: CreateCategoryRequest,
    @Param() params: Params,
  ) {
    this.categoryValidation.createSubcategory({ body, params });
    await this.categoryService.findCategory(params.id);

    return await this.categoryService.createSubcategory(body, params);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [privilegeKeys.updateCategory],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async update(@Body() body: UpdateCategoryRequest, @Param() params: Params) {
    this.categoryValidation.update({ body, params });
    const category = await this.categoryService.findOneById(params.id);
    return await this.categoryService.update(
      { ...body, imageId: body.image },
      params,
      category,
    );
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [privilegeKeys.viewCategory],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async getAll(@Headers() header: IHeaders, @Query() query: GetAllCategory) {
    this.categoryValidation.getAll({ query });
    const filter = new CategoryFilterObject().getParent(query.parent).build();
    const categories = await this.categoryService.findAll(filter);
    return {
      rows: categories.map((category) =>
        new GetByCriteriaCategoryResponse({
          category,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [privilegeKeys.viewCategory],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async getOne(@Headers() headers: IHeaders, @Param() params: Params) {
    this.categoryValidation.paramsId({ params });
    const category = await this.categoryService.findCategory(+params.id);
    return new GetByIdCategoryDashboardResponse({
      category,
      languageKey: headers.languageKey,
    });
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [privilegeKeys.deleteCategory],
    role: [Types.SUPER_ADMIN, Types.ADMIN],
  })
  async delete(@Param() params: Params) {
    this.categoryValidation.paramsId({ params });
    await this.categoryService.findOneById(params.id);
    await this.categoryService.delete(params);
    return;
  }
}
