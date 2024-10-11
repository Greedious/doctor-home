import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class DeliveryAreaError {
  notFoundError: Error = {
    message: 'Delivery Area Not Found',
    code: errorCode.notFoundArea,
  };

  notFound() {
    return this.notFoundError;
  }
}
