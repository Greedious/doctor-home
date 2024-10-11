import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class OperatorError {
  private notFoundError: Error = {
    message: 'Operator Not Found',
    code: errorCode.notFoundUser,
  };

  notFound() {
    return this.notFoundError;
  }
}
