import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class StudentError {
  private notFoundError: Error = {
    message: 'Student Not Found',
    code: errorCode.notFoundStudent,
  };

  private studentNotAssignedToGroupError: Error = {
    message:
      'You cannot change to this status because there are still students not assigned to group',
    code: errorCode.studentNotAssignedToGroup,
  };

  private subjectNotInStudentYearError: Error = {
    message: 'The subject is not in the student year',
    code: errorCode.subjectNotInStudentYear,
  };

  private studentsNotInSameGroupError: Error = {
    message: 'The students are not on same group',
    code: errorCode.studentsNotInSameGroup,
  };

  private studentHasNoChairOnSubjectError: Error = {
    message: 'Student has no chair on subject on his year',
    code: errorCode.studentHasNoChairOnSubject,
  };

  notFound() {
    return this.notFoundError;
  }

  studentNotAssignedToGroup() {
    return this.studentNotAssignedToGroupError;
  }

  subjectNotInStudentYear() {
    return this.subjectNotInStudentYearError;
  }

  studentsNotInSameGroup() {
    return this.studentsNotInSameGroupError;
  }

  studentHasNoChairOnSubject() {
    return this.studentHasNoChairOnSubjectError;
  }
}
