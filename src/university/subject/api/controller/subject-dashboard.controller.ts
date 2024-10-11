import { Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { SubjectDashboardService } from 'src/university/subject/service/subject-dashboard.service';
import {
  CreateSubjectRequest,
  GetAllSubjectQuery,
  UpdateSubjectRequest,
} from '../dto/request';
import { SubjectValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteriaSubjectResponse } from '../dto/response/get-all-subject.dto';
import { SubjectFilterObject } from 'src/university/subject/helper/subject-filter';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { paginationParser } from 'package/pagination/pagination';
import { YearService } from 'src/university/year/service/year.service';
import { TaskService } from 'src/university/task/service/task.service';
import { GetBySubjectTaskResponse } from '../dto/response/get-all-tasks.dto';

@AuthenticatedController({ controller: '/university/subjects' })
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectDashboardService,
    private readonly yearService: YearService,
    private readonly taskService: TaskService,
    private readonly subjectValidation: SubjectValidation,
  ) {}

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.createSubject],
  })
  //@AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async create(@Body() body: CreateSubjectRequest) {
    this.subjectValidation.create({ body });
    if (body.yearId) await this.yearService.checkYear(body.yearId);
    return await this.subjectService.create(body);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.updateSubject],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async update(@Body() body: UpdateSubjectRequest, @Param() params: Params) {
    this.subjectValidation.update({ body });
    this.subjectValidation.paramsId({ params });
    // if (body.yearId) await this.taskService.(body.yearId);
    return await this.subjectService.update(body, params);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id/cards',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.viewSubject],
  })
  async getCards(@Headers() header: IHeaders, @Param() params: Params) {
    this.subjectValidation.paramsId({ params });
    await this.subjectService.findOneById(+params.id);
    const { clinicalTasks, laboratoryTasks } =
      await this.taskService.getTasksTemplates(+params.id);
    return {
      clinicalTasks: clinicalTasks.map((task) =>
        new GetBySubjectTaskResponse({
          task,
          languageKey: header.languageKey,
        }).toObject(),
      ),
      laboratoryTasks: laboratoryTasks.map((task) =>
        new GetBySubjectTaskResponse({
          task,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.viewSubject],
  })
  async getOne(@Headers() header: IHeaders, @Param() params: Params) {
    this.subjectValidation.paramsId({ params });
    const subject = await this.subjectService.findOneById(+params.id);
    return new GetByCriteriaSubjectResponse({
      subject,
      languageKey: header.languageKey,
    }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.viewSubject],
  })
  async getAll(
    @Headers() header: IHeaders,
    @Query() query: GetAllSubjectQuery,
  ) {
    this.subjectValidation.getAll({ query });
    const { pagination } = paginationParser(query);
    const filter = new SubjectFilterObject()
      .getSeason(query.season)
      .getYear(query.year)
      .getSearch(query.search);

    const subjects = await this.subjectService.findAll(
      filter.build(),
      pagination,
    );
    return {
      count: subjects.count,
      rows: subjects.rows.map((subject) =>
        new GetByCriteriaSubjectResponse({
          subject,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.deleteSubject],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async delete(@Param() params: Params) {
    this.subjectValidation.paramsId({ params });
    await this.subjectService.findOneById(params.id);
    await this.subjectService.delete(params);
    return;
  }
}
