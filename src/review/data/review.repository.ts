import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './review.schema';

@Injectable()
export class ReviewRepository extends SequelizeRepository<Review> {
  constructor(
    @InjectModel(Review)
    reviewRepository: typeof Review,
  ) {
    super(reviewRepository);
  }
}
