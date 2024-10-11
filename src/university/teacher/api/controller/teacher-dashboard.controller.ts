import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { TeacherDashboardService } from '../../service/teacher-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import {
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  CreateTeacherRequest,
  GetTeachersQuery,
  UpdateTeacherRequest,
} from '../dto/request';
import { paginationParser } from 'package/pagination/pagination';
import { TeacherFilter } from '../../helper/teacher.filter';
import { Teacher } from '../../data/teacher.schema';
import { GetTeachersResponse } from '../dto/response/get-teachers';
import { TeacherValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { SpecialtyService } from 'src/university/specialty/service/specialty.service';
import { DoctorService } from 'src/account/doctor/service/doctor.service';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { GroupService } from 'src/university/group/service/group.service';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { TeacherError } from '../../service/teacher-error.service';
import { AuthorizedStatus } from 'src/shared/decorator/authorized-status.decorator';
import { universityStatus } from 'src/university/status/api/dto/request';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';
import { IHeaders } from 'package/types/header';
import { Headers } from 'package/decorator/param/header.decorator';
import { GetByIdTeacherResponse } from '../dto/response/get-by-id-teacher';

@AuthenticatedController({
  controller: '/university/teachers',
})
export class TeacherDashboardController {
  constructor(
    private teacherDashboardService: TeacherDashboardService,
    private specialtyService: SpecialtyService,
    private teacherError: TeacherError,
    private groupService: GroupService,
    private doctorService: DoctorService,
    private subjectService: SubjectService,
    private teacherValidation: TeacherValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.viewTeacher],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getTeachers(@Query() query: GetTeachersQuery) {
    this.teacherValidation.get({ query });
    const { pagination } = paginationParser(query);

    const filters = new TeacherFilter();
    if (query.search) filters.getSearch(query.search);

    const { count, rows } = await this.teacherDashboardService.findAll(
      filters.build(),
      pagination,
    );

    return {
      count,
      rows: rows.map((teacher: Teacher) =>
        new GetTeachersResponse(teacher).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.viewTeacher],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.teacherValidation.paramsId({ params });
    const teacher = await this.teacherDashboardService.findOne(+params.id);
    return new GetByIdTeacherResponse({ teacher, languageKey }).toObject();
  }

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [universityPrivilegeKeys.createTeacher],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  @UseInterceptors(TransactionInterceptor)
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  async createTeacher(
    @Body() body: CreateTeacherRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.teacherValidation.create({ body });

    // validating if the specialty of the teacher exists.
    if (body.specialtyId)
      await this.specialtyService.findOneById(body.specialtyId);

    // validating if each subject exists.

    // creating the teacher.
    const teacher = await this.teacherDashboardService.create(
      body,
      transaction,
    );

    // if the user is registered in the app then link him.
    if (body.phoneNumber) {
      const doctor = await this.doctorService.registerUniversityByPhoneNumber(
        body.phoneNumber,
        { teacherId: teacher.id },
        transaction,
      );
      await doctor.save({ transaction });
    }
    return {
      id: teacher.id,
    };
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateTeacher],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  @UseInterceptors(TransactionInterceptor)
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  async updateTeacher(
    @Body() body: UpdateTeacherRequest,
    @Param() params: Params,
    @TransactionParam() transaction: Transaction,
  ) {
    this.teacherValidation.update({ body, params });

    if (body.specialtyId)
      await this.teacherDashboardService.checkSpecialty(body.specialtyId);

    await this.teacherDashboardService.update(body, params.id, transaction);

    if (body.phoneNumber) {
      const doctor = await this.doctorService.registerUniversityByPhoneNumber(
        body.phoneNumber,
        { teacherId: +params.id },
        transaction,
      );
      await doctor.save({ transaction });
    }

    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteTeacher],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  async deleteTeacher(@Param() params: Params) {
    this.teacherValidation.paramsId({ params });
    return await this.teacherDashboardService.delete(params.id);
  }
}
