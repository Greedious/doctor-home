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

@AuthenticatedController({
  controller: '/university/students',
})
export class StudentDashboardController {
  constructor(
    private studentDashboardService: StudentDashboardService,
    private groupService: GroupService,
    private doctorService: DoctorService,
    private yearService: YearService,
    private studentValidation: StudentValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.viewStudent],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getStudents(
    @Query() query: GetStudentsQuery,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.studentValidation.get({ query });
    const { pagination } = paginationParser(query);

    const filters = new StudentFilter();
    if (query.search) filters.getSearch(query.search);

    const { count, rows } = await this.studentDashboardService.findAll(
      filters.build(),
      pagination,
    );

    return {
      count,
      rows: rows.map((student: Student) =>
        new GetStudentsResponse({ student, languageKey }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.viewStudent],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.studentValidation.paramsId({ params });

    const student = await this.studentDashboardService.findOne(+params.id);

    return new GetByIdStudentResponse({ student, languageKey }).toObject();
  }

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [universityPrivilegeKeys.createStudent],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  @UseInterceptors(TransactionInterceptor)
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  async createStudent(
    @Body() body: CreateStudentRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.studentValidation.create({ body });
    if (body.yearId) await this.yearService.checkYear(body.yearId);
    if (body.groupId)
      await this.groupService.checkGroup(body.groupId, body.yearId);
    const student = await this.studentDashboardService.create(
      body,
      transaction,
    );
    if (body.phoneNumber) {
      const doctor = await this.doctorService.registerUniversityByPhoneNumber(
        body.phoneNumber,
        { studentId: student.id },
        transaction,
      );
      doctor.studentId = student.id;
      await doctor.save({ transaction });
    }
    return { id: student.id };
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateStudent],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  @UseInterceptors(TransactionInterceptor)
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  @UsePipes(new ModifyPayloadPipe())
  async updateStudent(
    @Body() body: UpdateStudentRequest,
    @Param() params: Params,
    @TransactionParam() transaction: Transaction,
  ) {
    this.studentValidation.update({ body, params });
    if (body.year) await this.yearService.checkYear(body.year);
    if (body.group) await this.groupService.checkGroup(body.group, body.year);
    await this.studentDashboardService.update(body, params.id, transaction);
    if (body.phoneNumber) {
      const doctor = await this.doctorService.registerUniversityByPhoneNumber(
        body.phoneNumber,
        { studentId: +params.id },
        transaction,
      );
      doctor.studentId = +params.id;
      await doctor.save({ transaction });
    }
    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteStudent],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  async deleteStudent(@Param() params: Params) {
    this.studentValidation.paramsId({ params });
    return await this.studentDashboardService.delete(params.id);
  }
}
