import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class SupervisorError {
  private notFoundError: Error = {
    message: 'Supervisor Not Found',
    code: errorCode.notFoundSupervisor,
  };

  private notAssignedError: Error = {
    message: 'Supervisor is not assigned to this subject',
    code: errorCode.notAssignedSupervisor,
  };
  private notAssignedGroupError: Error = {
    message: 'Supervisor is not assigned to this group',
    code: errorCode.notAssignedSupervisor,
  };

  private alreadyAssignedError: Error = {
    message: 'Supervisor has already assigned this subject',
    code: errorCode.alreadyAssignedSupervisor,
  };
  private subjectOccupiedError: Error = {
    message: 'This Subject has other supervisor taught',
    code: errorCode.alreadyTaught,
  };

  private notFoundSupervisorSubjectError: Error = {
    message: 'Supervisor subject not found',
    code: errorCode.notFoundSubject,
  };

  private supervisorDoesNotTeachTheSubjectError: Error = {
    message: 'Supervisor does not teach the provided subject',
    code: errorCode.supervisorDoesNotTeachTheSubject,
  };

  notFound() {
    return this.notFoundError;
  }
  notAssigned() {
    return this.notAssignedError;
  }
  notAssignedGroup() {
    return this.notAssignedGroupError;
  }
  alreadyAssigned() {
    return this.alreadyAssignedError;
  }
  subjectOccupied() {
    return this.subjectOccupiedError;
  }
  notFoundSupervisorSubject() {
    return this.notFoundSupervisorSubjectError;
  }
  supervisorDoesNotTeachSubject() {
    return this.supervisorDoesNotTeachTheSubjectError;
  }
}
