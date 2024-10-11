import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { StatusDashboardService } from '../../service/status-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { Body, UseInterceptors } from '@nestjs/common';
import { UpdateStatusRequest, universityStatus } from '../dto/request';
import { GetStatusesDashboardResponse } from '../dto/response/get-dashboard-status';
import { StatusValidation } from '../validation';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { TeacherService } from 'src/university/teacher/service/teacher.service';
import { StudentService } from 'src/university/student/service/student.service';

@AuthenticatedController({
  controller: '/university/statuses',
})
export class StatusDashboardController {
  constructor(
    private statusDashboardService: StatusDashboardService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private statusValidation: StatusValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.createStatus],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getStatuses(@Headers() { languageKey }: IHeaders) {
    const status = await this.statusDashboardService.find();

    return new GetStatusesDashboardResponse({ status, languageKey }).toObject();
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateStatus],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async updateStatus(@Body() body: UpdateStatusRequest) {
    this.statusValidation.update({ body });
    const status = await this.statusDashboardService.find();

    this.statusDashboardService.checkIfValid(status, body.status);

    const checks: Promise<any>[] = [];
    if (body.status === universityStatus.registrationPhase) {
      //make sure that every subject has it's own card
      checks.push(this.subjectService.checkEachSubjectHasAtLeastOneTask());
      // each subject has at least chair
      checks.push(this.subjectService.checkEachSubjectHasAtLeastOneChair());
    }

    if (body.status === universityStatus.schedulingPhase) {
      checks.push(this.studentService.checkIfAllHasGroup());
      checks.push(this.teacherService.checkNoFreeTeachers());
      checks.push(this.subjectService.checkNoFreeSubjects());
    }

    if (body.status === universityStatus.attendancePhase) {
      // each subject has schedule for each group in same year
      checks.push(this.subjectService.checkEverySubjectHasGroupSchedule());
      // each student has chair in each subject in his year
      checks.push(this.studentService.checkEveryStudentsHasChairs());
    }
    await Promise.all(checks);

    return await this.statusDashboardService.update(status, body);
  }
}
