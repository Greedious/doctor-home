import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class MarkError {
  private notFoundError: Error = {
    message: 'Mark Not Found',
    code: errorCode.notFoundMark,
  };

  private studentAlreadyHasMarkError: Error = {
    message: 'Student Has Already Mark In This Subject',
    code: errorCode.studentAlreadyHasMark,
  };

  notFound() {
    return this.notFoundError;
  }

  studentAlreadyHasMark() {
    return this.studentAlreadyHasMarkError;
  }
}
