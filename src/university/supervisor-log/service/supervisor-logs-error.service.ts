import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class SupervisorLogError {
  private notFoundError: Error = {
    message: 'SupervisorLog Not Found',
    code: errorCode.notFoundSupervisorLog,
  };

  notFound() {
    return this.notFoundError;
  }
}
