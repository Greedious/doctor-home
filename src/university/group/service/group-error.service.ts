import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class GroupError {
  private notFoundError: Error = {
    message: 'Group Not Found',
    code: errorCode.notFoundGroup,
  };

  private notFoundGroupScheduleError: Error = {
    message: 'Group schedule not found',
    code: errorCode.notFoundGroup,
  };

  private groupIsNotAvailableInThisTimeError: Error = {
    message: 'Group is not available at this time',
    code: errorCode.groupIsNotAvailable,
  };

  private alreadyAssignedError: Error = {
    message: 'Group is already assigned to this subject',
    code: errorCode.alreadyAssignedGroup,
  };

  private notSameYearWithSubjectError: Error = {
    message: 'Group year is not compatible with subject year',
    code: errorCode.notSameYearWithSubject,
  };

  groupIsNotAvailableInThisTime() {
    return this.groupIsNotAvailableInThisTimeError;
  }

  notFound() {
    return this.notFoundError;
  }

  alreadyAssignedGroup() {
    return this.alreadyAssignedError;
  }
  notFoundGroupSchedule() {
    return this.notFoundGroupScheduleError;
  }
  notSameYearWithSubject() {
    return this.notSameYearWithSubjectError;
  }
}
