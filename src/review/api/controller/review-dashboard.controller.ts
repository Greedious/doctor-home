import { Query } from '@nestjs/common';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { ReviewDashboardService } from 'src/review/service/review-dashboard.service';
import { GetAllReviewsQuery } from '../dto/request';
import { ReviewValidation } from '../validation';
import { paginationParser } from 'package/pagination/pagination';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { FilterService } from 'package/helpers/filtering-service';
import { ReviewFilterObject } from 'src/review/helper/review-filter';

@AuthenticatedController({
  controller: 'reviews',
})
export class ReviewDashboardController {
  constructor(
    private readonly reviewDashboardService: ReviewDashboardService,
    private readonly reviewValidation: ReviewValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    role: [Types.SUPER_ADMIN, Types.ADMIN],
    privilege: [privilegeKeys.viewReview],
    url: '/',
  })
  async getAll(@Query() query: GetAllReviewsQuery) {
    this.reviewValidation.getAll({ query });
    const { pagination } = paginationParser(query);
    const filter = new ReviewFilterObject()
      .getProduct(query.product)
      .getUser(query.user)
      .build();
    const response = await this.reviewDashboardService.find(filter, pagination);
    return response;
  }
}
