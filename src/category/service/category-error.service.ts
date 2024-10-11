import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class CategoryError {
  notFoundError: Error = {
    message: 'Category Not Found',
    code: errorCode.notFoundCategory,
  };

  cannotAddImageError: Error = {
    message: 'subcategory cannot has an image',
    code: errorCode.noImageSubcategory,
  };

  notFound() {
    return this.notFoundError;
  }
}
