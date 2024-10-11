import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';
@Injectable()
export class FavoriteError {
  private notFoundError: Error = {
    message: 'Product is Not Found in favorite',
    code: errorCode.notFoundFavoriteProduct,
  };

  private alreadyInFavoriteError: Error = {
    code: errorCode.alreadyFavorite,
    message: 'product is already in favorite',
  };

  notFound() {
    return this.notFoundError;
  }

  alreadyInFavorite() {
    return this.alreadyInFavoriteError;
  }
}
