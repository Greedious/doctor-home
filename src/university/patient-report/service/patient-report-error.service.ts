import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class PatientReportError {
  private notFoundError: Error = {
    message: 'Patient Report Not Found',
    code: errorCode.notFoundPatientReport,
  };

  notFound() {
    return this.notFoundError;
  }
}
