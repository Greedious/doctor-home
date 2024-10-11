import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { StudentDashboardService } from '../../service/student-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { Body, Param, Query, UseInterceptors, UsePipes } from '@nestjs/common';
import {
  CreateStudentRequest,
  GetStudentsQuery,
  UpdateStudentRequest,
} from '../dto/request';
import { paginationParser } from 'package/pagination/pagination';
import { StudentFilter } from '../../helper/student.filter';
import { Student } from '../../data/student.schema';
import { GetStudentsResponse } from '../dto/response/get-students';
import { StudentValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { GroupService } from 'src/university/group/service/group.service';
import { YearService } from 'src/university/year/service/year.service';
import { DoctorService } from 'src/account/doctor/service/doctor.service';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthorizedStatus } from 'src/shared/decorator/authorized-status.decorator';
import { universityStatus } from 'src/university/status/api/dto/request';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';
import { GetByIdStudentResponse } from '../dto/response/get-by-id-student';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { StudentMobileService } from '../../service/student-mobile.service';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { SupervisorService } from 'src/university/supervisor/service/supervisor.service';
import { GetStudentsForSupervisorResponse } from '../dto/response/get-students-mobile-for-supervisor.dto';

@AuthenticatedController({
  controller: '/university/mobile/students',
})
export class StudentMobileController {
  constructor(
    private readonly studentValidation: StudentValidation,
    private readonly studentMobileService: StudentMobileService,
    private readonly subjectService: SubjectService,
    private readonly supervisorService: SupervisorService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/for-supervisor',
    role: [Types.SUPERVISOR],
  })
  async getSupervisorStudents(
    @Query() query: GetStudentsQuery,
    @Headers() { languageKey }: IHeaders,
    @User() user: IUser,
  ) {
    this.studentValidation.get({ query });
    const { pagination } = paginationParser(query);

    const filters = new StudentFilter();
    if (query.search) filters.getSearch(query.search);
    const supervisor = await this.supervisorService.findOneById(
      user.supervisor,
    );
    const subject = await this.subjectService.findOne(supervisor.subjectId);

    const { count, rows } = await this.studentMobileService.findAll(
      filters.build(),
      pagination,
      subject.id,
    );

    return {
      count,
      rows: rows.map(
        (student: Student) =>
          new GetStudentsForSupervisorResponse({ student, languageKey }),
      ),
    };
  }
}
