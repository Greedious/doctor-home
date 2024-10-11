import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class TeacherError {
  private notFoundError: Error = {
    message: 'Teacher Not Found',
    code: errorCode.notFoundTeacher,
  };

  private notAssignedError: Error = {
    message: 'Teacher is not assigned to this subject',
    code: errorCode.notAssignedTeacher,
  };
  private notAssignedGroupError: Error = {
    message: 'Teacher is not assigned to this group',
    code: errorCode.notAssignedTeacher,
  };

  private alreadyAssignedError: Error = {
    message: 'Teacher has already assigned this subject',
    code: errorCode.alreadyAssignedTeacher,
  };

  private notFoundTeacherSubjectError: Error = {
    message: 'Teacher subject not found',
    code: errorCode.notFoundSubject,
  };

  private teacherDoesNotTeachTheSubjectError: Error = {
    message: 'Teacher does not teach the provided subject',
    code: errorCode.teacherDoesNotTeachTheSubject,
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
  notFoundTeacherSubject() {
    return this.notFoundTeacherSubjectError;
  }
  teacherDoesNotTeachSubject() {
    return this.teacherDoesNotTeachTheSubjectError;
  }
}
