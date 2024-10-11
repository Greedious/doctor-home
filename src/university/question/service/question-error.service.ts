import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class QuestionError {
  notFoundError: Error = {
    message: 'Question Not Found',
    code: errorCode.notFoundQuestion,
  };

  notFound() {
    return this.notFoundError;
  }
}
