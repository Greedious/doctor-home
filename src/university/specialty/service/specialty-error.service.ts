import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class SpecialtyError {
  private notFoundError: Error = {
    message: 'Specialty Not Found',
    code: errorCode.notFoundSpecialty,
  };

  private specialtyCannotDeleteError: Error = {
    message: 'you cannot delete this specialty',
    code: errorCode.cannotDeleteSpecialty,
  };

  specialtyCannotDelete() {
    return this.specialtyCannotDeleteError;
  }

  notFound() {
    return this.notFoundError;
  }
}
