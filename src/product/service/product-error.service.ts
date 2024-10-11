import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';
import { ProductDto } from '../api/dto/request';

@Injectable()
export class ProductError {
  private notFoundError: Error = {
    message: 'Product Not Found',
    code: errorCode.notFoundProduct,
  };

  notFound() {
    return this.notFoundError;
  }
  changeInCard({ resultProducts }: { resultProducts: ProductDto[] }) {
    return {
      message: { resultProducts },
      code: errorCode.cardIsChanged,
    };
  }
}
