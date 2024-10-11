import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class ReviewError {
  private notFoundError: Error = {
    message: 'Review Not Found',
    code: errorCode.notFoundReview,
  };
  private reviewedProductError: Error = {
    message: 'You already reviewed this product',
    code: errorCode.alreadyReviewedProduct,
  };

  notFound() {
    return this.notFoundError;
  }

  reviewedProduct() {
    return this.reviewedProductError;
  }
}
