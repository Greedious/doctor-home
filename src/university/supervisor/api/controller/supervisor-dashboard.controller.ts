import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { SupervisorDashboardService } from '../../service/supervisor-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { Body, Param, Query, UseInterceptors } from '@nestjs/common';
import {
  CreateSupervisorRequest,
  GetSupervisorsQuery,
  UpdateSupervisorRequest,
} from '../dto/request';
import { paginationParser } from 'package/pagination/pagination';
import { SupervisorFilter } from '../../helper/supervisor.filter';
import { Supervisor } from '../../data/supervisor.schema';
import { GetSupervisorsResponse } from '../dto/response/get-supervisors';
import { SupervisorValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { SpecialtyService } from 'src/university/specialty/service/specialty.service';
import { DoctorService } from 'src/account/doctor/service/doctor.service';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { GroupService } from 'src/university/group/service/group.service';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { SupervisorError } from '../../service/supervisor-error.service';
import { IHeaders } from 'package/types/header';
import { Headers } from 'package/decorator/param/header.decorator';
import { GetByIdSupervisorResponse } from '../dto/response/get-by-id-supervisor';

@AuthenticatedController({
  controller: '/university/supervisors',
})
export class SupervisorDashboardController {
  constructor(
    private supervisorDashboardService: SupervisorDashboardService,
    private specialtyService: SpecialtyService,
    private supervisorError: SupervisorError,
    private groupService: GroupService,
    private doctorService: DoctorService,
    private subjectService: SubjectService,
    private supervisorValidation: SupervisorValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.viewSupervisor],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getSupervisors(@Query() query: GetSupervisorsQuery) {
    this.supervisorValidation.get({ query });
    const { pagination } = paginationParser(query);

    const filters = new SupervisorFilter();
    if (query.search) filters.getSearch(query.search);

    const { count, rows } = await this.supervisorDashboardService.findAll(
      filters.build(),
      pagination,
    );

    return {
      count,
      rows: rows.map((supervisor: Supervisor) =>
        new GetSupervisorsResponse(supervisor).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.viewSupervisor],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.supervisorValidation.paramsId({ params });
    const supervisor = await this.supervisorDashboardService.findOne(
      +params.id,
    );
    return new GetByIdSupervisorResponse({
      supervisor,
      languageKey,
    }).toObject();
  }

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    //privilege: [universityPrivilegeKeys.createSupervisor],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  @UseInterceptors(TransactionInterceptor)
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  async createSupervisor(
    @Body() body: CreateSupervisorRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.supervisorValidation.create({ body });

    // validating if the specialty of the supervisor exists.
    if (body.specialtyId)
      await this.specialtyService.findOneById(body.specialtyId);

    if (body.subjectId) {
      await this.subjectService.findOne(body.subjectId);
      await this.supervisorDashboardService.checkSubjectNotTaught(
        body.specialtyId,
      );
    }

    // validating if each subject exists.

    // creating the supervisor.
    const supervisor = await this.supervisorDashboardService.create(
      body,
      transaction,
    );

    // if the user is registered in the app then link him.
    if (body.phoneNumber) {
      const doctor = await this.doctorService.registerUniversityByPhoneNumber(
        body.phoneNumber,
        { supervisorId: supervisor.id },
        transaction,
      );
      doctor.supervisorId = supervisor.id;
      await doctor.save({ transaction });
    }
    return {
      id: supervisor.id,
    };
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateSupervisor],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  @UseInterceptors(TransactionInterceptor)
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  async updateSupervisor(
    @Body() body: UpdateSupervisorRequest,
    @Param() params: Params,
    @TransactionParam() transaction: Transaction,
  ) {
    this.supervisorValidation.update({ body, params });

    if (body.specialtyId)
      await this.supervisorDashboardService.checkSpecialty(body.specialtyId);

    await this.supervisorDashboardService.update(body, params.id, transaction);

    if (body.phoneNumber) {
      const doctor = await this.doctorService.registerUniversityByPhoneNumber(
        body.phoneNumber,
        { supervisorId: +params.id },
        transaction,
      );
      await doctor.update({ supervisorId: +params.id }, { transaction });
    }

    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteSupervisor],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.registrationPhase] })
  async deleteSupervisor(@Param() params: Params) {
    this.supervisorValidation.paramsId({ params });
    return await this.supervisorDashboardService.delete(params.id);
  }
}
