import { Body, Param, Query } from '@nestjs/common';
import { CreateCardRequest, UpdateTask } from '../dto/request';
import { TaskValidation } from '../validation';
import { MongooseParams, Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { TaskDashboardService } from '../../service/task-dashboard.service';
import { SubjectService } from 'src/university/subject/service/subject.service';

@AuthenticatedController({
  controller: '/university/tasks',
})
export class TaskDashboardController {
  constructor(
    private readonly taskService: TaskDashboardService,
    private readonly subjectService: SubjectService,
    private readonly taskValidation: TaskValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    // privilege: [universityPrivilegeKeys.createTask],
    // role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async create(@Body() body: CreateCardRequest) {
    this.taskValidation.create({ body });
    await this.subjectService.findOne(body.subjectId);
    await this.taskService.checkForSubject(body.subjectId);
    return await this.taskService.create(body);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateTask],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async update(@Body() body: UpdateTask, @Param() params: MongooseParams) {
    this.taskValidation.update({ body, params });
    await this.taskService.findOneById(params.id);
    return await this.taskService.update(body, +params.id);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.viewTask],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    // this.taskValidation.paramsId({ params });
    // const task = await this.taskService.findOne(params);
    // return new GetByIdTaskDashboardResponse({
    //   task,
    //   languageKey,
    // }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.viewTask],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async getAll(@Headers() header: IHeaders, @Query() query) {
    // this.taskValidation.getAll({ query });
    // const ads = await this.taskService.findAll();
    // return {
    //   rows: ads.map((task) =>
    //     new GetByCriteriaTasksDashboardResponse({
    //       task: task,
    //       languageKey: header.languageKey,
    //     }).toObject(),
    //   ),
    // };
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteTask],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async delete(@Param() params: MongooseParams) {
    this.taskValidation.paramsId({ params });
    await this.taskService.findOneById(params.id);
    await this.taskService.delete(+params.id);
    return;
  }
}
