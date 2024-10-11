import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class VariantError {
  private notFoundError: Error = {
    message: 'Variant Not Found',
    code: errorCode.notFoundVariant,
  };

  notFound() {
    return this.notFoundError;
  }
}
