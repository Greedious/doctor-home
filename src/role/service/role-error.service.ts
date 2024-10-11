import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class RoleError {
  notFoundError: Error = {
    message: 'Role Not Found',
    code: errorCode.notFoundRole,
  };

  notFound() {
    return this.notFoundError;
  }
}
