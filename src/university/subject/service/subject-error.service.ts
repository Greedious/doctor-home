import { Injectable } from '@nestjs/common';
import { Error } from 'package/utils/Error/error';
import { errorCode } from 'package/utils/Error/error-codes';

@Injectable()
export class SubjectError {
  private notFoundError: Error = {
    message: 'Subject Not Found',
    code: errorCode.notFoundSubject,
  };

  private subjectHasNoAssignedTaskError: Error = {
    message: 'Subject has no assigned task',
    code: errorCode.subjectHasNoAssignedTask,
  };

  private subjectHasNoTeacherError: Error = {
    message: 'Subject has to be assigned to at least one teacher',
    code: errorCode.subjectHasNoTeacher,
  };

  private subjectHasMissingSchedulesError: Error = {
    message:
      'Each subject must has schedule for each group in the same year as subject',
    code: errorCode.subjectHasMissingSchedules,
  };

  private subjectHasNoChairsError: Error = {
    message: 'Subject must has at least one chair',
    code: errorCode.subjectHasNoChairs,
  };

  notFound() {
    return this.notFoundError;
  }

  subjectHasNoAssignedTask() {
    return this.subjectHasNoAssignedTaskError;
  }

  subjectHasNoTeacher() {
    return this.subjectHasNoTeacherError;
  }

  subjectHasMissingSchedules() {
    return this.subjectHasMissingSchedulesError;
  }

  subjectHasNoChairs() {
    return this.subjectHasNoChairsError;
  }
}
