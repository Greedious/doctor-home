import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../data/review.repository';
import { UpdateReview } from '../api/dto/request';
import { FilterService } from 'package/helpers/filtering-service';
import { orderCriteria } from 'package/utils/methods';
import { ReviewEntity } from '../api/dto/response/find-reviews-dashboard.dto';
import { GetAllReviewsQuery } from '../api/dto/request';
import { GetByCriteria } from 'package/pagination/dto';
import { CategoryService } from 'src/category/service/category.service';
import { ReviewError } from './review-error.service';
import { Review } from '../data/review.schema';
import { WhereOptions } from 'sequelize';

@Injectable()
export class ReviewDashboardService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly categoryService: CategoryService,
    private readonly reviewError: ReviewError,
  ) {}

  async find(filter: WhereOptions<Review>, pagination: GetByCriteria) {
    let limit = undefined,
      offset = undefined;
    if (pagination.needPagination) {
      limit = pagination.limit;
      offset = pagination.skip;
    }
    const { count, rows } = await this.reviewRepository.findAndCount({
      where: filter,
      options: {
        limit,
        offset,
      },
    });
    return {
      count,
      rows: rows.map((review) => new ReviewEntity({ review }).toObject()),
    };
  }
}
