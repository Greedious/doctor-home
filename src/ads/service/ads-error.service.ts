import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class AdsError {
  notFoundError: Error = {
    message: 'Ads Not Found',
    code: errorCode.notFoundAd,
  };

  notFound() {
    return this.notFoundError;
  }
}
