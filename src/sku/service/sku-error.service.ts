import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class SkuError {
  notFoundError: Error = {
    message: 'Sku Not Found',
    code: errorCode.notFoundProduct,
  };

  notFound() {
    return this.notFoundError;
  }
}
