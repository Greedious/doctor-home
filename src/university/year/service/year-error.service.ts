import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class YearError {
  private notFoundError: Error = {
    message: 'Year Not Found',
    code: errorCode.notFoundYear,
  };
  private sameYearRankError: Error = {
    message: 'Year with same rank already exists',
    code: errorCode.sameYearRank,
  };

  notFound() {
    return this.notFoundError;
  }

  sameYearRank() {
    return this.sameYearRankError;
  }
}
