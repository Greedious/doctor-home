import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class PatientError {
  private notFoundError: Error = {
    message: 'Patient Not Found',
    code: errorCode.notFoundPatient,
  };

  notFound() {
    return this.notFoundError;
  }
}
