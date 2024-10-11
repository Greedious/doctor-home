import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class StatusError {
  private notFoundError: Error = {
    message: 'Status Not Found',
    code: errorCode.notFoundStatus,
  };

  private notValidStatusError: Error = {
    message: 'Status updated is not valid',
    code: errorCode.notValidStatus,
  };

  notFound() {
    return this.notFoundError;
  }
  notValidStatus() {
    return this.notValidStatusError;
  }
}
