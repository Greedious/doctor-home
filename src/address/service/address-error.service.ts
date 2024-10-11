import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class AddressError {
  private notFoundError: Error = {
    message: 'Address Not Found',
    code: errorCode.notFoundAddress,
  };

  notFound() {
    return this.notFoundError;
  }
}
