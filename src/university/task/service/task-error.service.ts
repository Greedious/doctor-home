import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class TaskError {
  notFoundError: Error = {
    message: 'Task Not Found',
    code: errorCode.notFoundTask,
  };

  alreadyHasCardError: Error = {
    message: 'Subject already has card',
    code: errorCode.alreadyHasCard,
  };

  notFound() {
    return this.notFoundError;
  }

  alreadyHasCard() {
    return this.alreadyHasCardError;
  }
}
