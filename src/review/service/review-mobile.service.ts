import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReviewRepository } from '../data/review.repository';
import { CreateReview } from '../api/dto/request';
import { ReviewError } from './review-error.service';
import { Review } from '../data/review.schema';
import { ProductError } from 'src/product/service/product-error.service';
import { IUser } from 'src/shared/types/user';
import { ProductService } from 'src/product/service/product.service';
import { Transaction, WhereOptions } from 'sequelize';
import { User } from 'src/account/user/data/user.schema';
import { Doctor } from 'src/account/doctor/data/doctor.schema';
import { Product } from 'src/product/data/product.schema';

@Injectable()
export class ReviewMobileService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewError: ReviewError,
    private readonly productError: ProductError,
    private productService: ProductService,
  ) {}

  async findOneById(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      error: this.reviewError.notFound(),
    });
    return review;
  }

  async updateProduct(
    productId: number,
    review: number,
    transaction: Transaction,
  ) {
    const product = await this.productService.findOne(productId);
    product.set('rateSum', product.rateSum + review);
    product.set('totalRates', product.totalRates + 1);
    product.reviewCount[review - 1]++;
    await product.save({ transaction });
  }

  async isReviewed(productId: number, user: IUser) {
    const review = await this.reviewRepository.findOne({
      where: { userId: user.id, productId },
    });
    if (review) {
      throw new HttpException(
        this.reviewError.reviewedProduct(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(body: CreateReview, user: IUser, transaction: Transaction) {
    return await this.reviewRepository.create({
      doc: { ...body, userId: user.id },
      options: { transaction },
    });
  }

  async findAll(
    filter: WhereOptions<Review>,
    { limit, skip }: { limit: number; skip: number },
  ) {
    const reviews = await this.reviewRepository.findAndCount({
      where: filter,
      options: { limit, offset: skip },
      include: [{ model: User, include: [Doctor] }, Product],
    });
    return reviews;
  }

  async delete(id: number) {
    const review = await this.findOneById(id);
    await review.destroy();
    return;
  }
}
