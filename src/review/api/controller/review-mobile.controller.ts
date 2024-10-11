import { Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { CreateReviewRequest, GetAllReviewsQuery } from '../dto/request';
import { ReviewValidation } from '../validation';
import { ReviewMobileService } from 'src/review/service/review-mobile.service';
import { Types } from 'src/account/user/data/user.schema';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { paginationParser } from 'package/pagination/pagination';
import { ReviewFilterObject } from 'src/review/helper/review-filter';
import { GetAllReviewMobileDto } from '../dto/response/get-all-reviews-mobile.dto';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { roundToNearest } from 'package/utils/round-for-rate';
import { ProductService } from 'src/product/service/product.service';
import { Params } from 'package/component/params/params';

@AuthenticatedController({
  controller: 'mobile/reviews',
})
export class ReviewMobileController {
  constructor(
    private readonly reviewService: ReviewMobileService,
    private readonly productService: ProductService,
    private readonly reviewValidation: ReviewValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/',
    role: [Types.DOCTOR],
  })
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Body() body: CreateReviewRequest,
    @User() user: IUser,
    @TransactionParam() transaction: Transaction,
  ) {
    this.reviewValidation.create({ body });
    await this.reviewService.updateProduct(
      body.product,
      body.rate,
      transaction,
    );
    await this.reviewService.isReviewed(body.product, user);
    const review = await this.reviewService.create(
      { ...body, productId: body.product },
      user,
      transaction,
    );
    return { id: review.id };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/',
    role: [Types.DOCTOR],
  })
  async getAll(
    @Query() query: GetAllReviewsQuery,
    // { languageKey }: IHeaders,
  ) {
    this.reviewValidation.getAll({ query });
    const { pagination } = paginationParser(query);
    const filter = new ReviewFilterObject()
      .getProduct(query.product)
      .getComments()
      .build();
    const reviews = await this.reviewService.findAll(filter, pagination);
    const product = await this.productService.findOne(query.product);

    return {
      count: reviews.count,
      row: {
        totalRate: product.totalRates,
        reviewCount: product.reviewCount,
        rate: product.totalRates
          ? roundToNearest(
              Number(
                (
                  reviews.rows[0].product.rateSum /
                  reviews.rows[0].product.totalRates
                ).toFixed(2),
              ),
            )
          : 0,
        reviews: reviews.rows.map((review) => {
          return new GetAllReviewMobileDto({ review }).toObject();
        }),
      },
    };
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    role: [Types.DOCTOR],
  })
  async delete(@Param() params: Params) {
    this.reviewValidation.paramsId({ params });
    await this.reviewService.delete(+params.id);
    return;
  }
}
