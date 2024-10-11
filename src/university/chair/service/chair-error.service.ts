import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class ChairError {
  private notFoundError: Error = {
    message: 'Chair Not Found',
    code: errorCode.notFoundChair,
  };

  private capacityLimitExceededError: Error = {
    message: 'Chair cannot hold more students in the same subject and group',
    code: errorCode.chairCapacityLimitExceeded,
  };

  notFound() {
    return this.notFoundError;
  }
  capacityLimitExceeded() {
    return this.capacityLimitExceededError;
  }
}
