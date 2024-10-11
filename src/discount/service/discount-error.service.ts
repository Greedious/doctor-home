import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class DiscountError {
  private notFoundError: Error = {
    message: 'Discount Not Found',
    code: errorCode.notFoundDiscount,
  };
  private discountExistError: Error = {
    message: 'Discount Already exist',
    code: errorCode.discountExist,
  };

  notFound() {
    return this.notFoundError;
  }

  discountExist() {
    return this.discountExistError;
  }
}
