import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class AppointmentError {
  private notFoundError: Error = {
    message: 'Appointment Not Found',
    code: errorCode.notFoundAppointment,
  };
  private notInAllowedTimeError: Error = {
    message: 'The appointment you booked is not in the allowed times',
    code: errorCode.notAllowedTime,
  };
  private conflictInTimeError: Error = {
    message:
      'there has been conflict and another appointment is booked in this time',
    code: errorCode.appointmentConflict,
  };
  private appointmentDoesNotHavePatientError: Error = {
    message:
      'The appointment does not have patient !, please add patient to the appointment and try again',
    code: errorCode.appointmentDoesNotHavePatient,
  };

  notFound() {
    return this.notFoundError;
  }

  notInAllowedTime() {
    return this.notInAllowedTimeError;
  }

  conflictInTime() {
    return this.conflictInTimeError;
  }

  appointmentDoesNotHavePatient() {
    return this.appointmentDoesNotHavePatientError;
  }
}
