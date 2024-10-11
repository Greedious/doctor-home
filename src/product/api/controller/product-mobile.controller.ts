import { Body, Param, Query, UsePipes } from '@nestjs/common';
import { ProductMobileService } from 'src/product/service/product-mobile.service';
import { ProductValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByIdProductMobileResponse } from '../dto/response/get-by-id-mobile-product.dto';
import { paginationParser } from 'package/pagination/pagination';
import { ProductFilterObject } from 'src/product/helper/product-filter';
import { GetByCriteriaProductMobileResponse } from '../dto/response/get-all-product-mobile.dto';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import {
  CheckProducts,
  GetAllProductMobileQuery,
  GetByIdProductQuery,
} from '../dto/request';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { CurrentUser } from 'package/decorator/authorization/user.decorator';
import { IUser } from 'src/shared/types/user';
import { FavoriteFilterObject } from 'src/favorite/helper/favorite-filter';
import { FavoriteService } from 'src/favorite/service/favorite.service';
import { User } from 'package/decorator/param/user.decorator';

@AuthenticatedController({ controller: '/mobile/products' })
export class ProductMobileController {
  constructor(
    private readonly productService: ProductMobileService,
    private readonly favoriteService: FavoriteService,
    private readonly productValidation: ProductValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/check',
    role: [Types.DOCTOR],
  })
  async checkProducts(@Body() body: CheckProducts) {
    this.productValidation.checkProduct({ body });
    const { products, totalPrice } =
      await this.productService.checkProduct(body);
    return {
      products,
      price: totalPrice,
      tax: 0,
      delivery: 0,
      totalPrice,
    };
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/favorite/:id',
    role: [Types.DOCTOR],
  })
  async updateFavorite(@Param() params: Params, @User() user: IUser) {
    this.productValidation.paramsId({ params });
    await this.productService.findOneById(+params.id);
    return await this.favoriteService.addOrRemoveProductFavorites(
      user,
      +params.id,
    );
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.DOCTOR],
  })
  async findOne(
    @Param() params: Params,
    @Headers() { languageKey }: IHeaders,
    @Query() query: GetByIdProductQuery,
    @CurrentUser() user: IUser,
  ) {
    this.productValidation.paramsId({ params });
    this.productValidation.getByIdMobile({ query });
    const product = await this.productService.findOne(params, query, user);
    return {
      row: new GetByIdProductMobileResponse({
        product,
        languageKey,
        user,
      }).toObject(),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.DOCTOR],
  })
  async findAll(
    @Query() query: GetAllProductMobileQuery,
    @Headers() { languageKey }: IHeaders,
    @CurrentUser() user: IUser,
  ) {
    this.productValidation.getAllMobile({ query });

    const { pagination } = paginationParser(query);
    const filter = new ProductFilterObject().getIsActive(true);
    const { categoryId, subcategoryId, search } = query;

    if (categoryId) filter.getCategoryId(categoryId);
    if (subcategoryId) filter.getSubcategoryId(subcategoryId);
    if (search) filter.getSearch(search);

    const favoriteFilter = new FavoriteFilterObject()
      .getUserId(user.id)
      .build();

    const product = await this.productService.findAll(
      query,
      filter.build(),
      pagination,
      user,
      favoriteFilter,
    );
    return {
      count: product.count,
      rows: product.rows.map((product) =>
        new GetByCriteriaProductMobileResponse({
          product,
          languageKey,
          user,
        }).toObject(),
      ),
    };
  }
}
