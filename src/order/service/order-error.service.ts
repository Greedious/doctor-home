import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class OrderError {
  notFoundError: Error = {
    message: 'Order Not Found',
    code: errorCode.notFoundOrder,
  };

  notFound() {
    return this.notFoundError;
  }
}
