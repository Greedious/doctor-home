import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../data/review.repository';
import { ReviewError } from './review-error.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewError: ReviewError,
  ) {}
}
