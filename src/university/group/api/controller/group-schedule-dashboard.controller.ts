import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { GroupDashboardService } from '../../service/group-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { Body, Param, Query } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { GroupValidation } from '../validation';
import {
  CreateGroupScheduleRequest,
  UpdateGroupScheduleRequest,
} from '../dto/response';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { GetGroupSchedulesDashboardResponse } from '../dto/response/get-group-schedules-dashboard';
import { GetOneGroupSchedulesDashboardResponse } from '../dto/response/get-one-group-schedule';
import { IHeaders } from 'package/types/header';
import { Headers } from 'package/decorator/param/header.decorator';
import { DeleteGroupSchedule } from '../dto/request';

@AuthenticatedController({
  controller: '/university/group-schedule',
})
export class GroupScheduleDashboardController {
  constructor(
    private readonly groupDashboardService: GroupDashboardService,
    private readonly groupValidation: GroupValidation,
    private readonly subjectService: SubjectService,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.createGroup],
  })
  async create(
    @Body() body: CreateGroupScheduleRequest,
    @Param() params: Params,
  ) {
    this.groupValidation.createSchedule({ body, params });
    await this.groupDashboardService.findById(+params.id);
    await this.subjectService.findOne(body.subjectId);
    await this.groupDashboardService.checkIfAssignedSchedule(
      +params.id,
      body.subjectId,
    );
    await this.groupDashboardService.isAvailableTime(+params.id, body);
    await this.groupDashboardService.createSchedule(params, body);
    return;
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.updateGroup],
  })
  async update(
    @Body() body: UpdateGroupScheduleRequest,
    @Param() params: Params,
  ) {
    this.groupValidation.updateSchedule({ body, params });
    await this.groupDashboardService.findById(+params.id);
    await this.subjectService.findOne(body.subjectId);
    await this.groupDashboardService.updateSchedule(params, body);
    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.deleteGroup],
  })
  async delete(@Body() body: DeleteGroupSchedule, @Param() params: Params) {
    this.groupValidation.delete({ body, params });
    await this.groupDashboardService.findById(+params.id, true);
    await this.subjectService.findOne(body.subjectId);
    await this.groupDashboardService.deleteSchedule(+params.id, body.subjectId);
    return;
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.viewGroup],
  })
  async getGroupSchedules(
    @Headers() headers: IHeaders,
    @Param() params: Params,
  ) {
    this.groupValidation.paramsId({ params });

    const groupId = +params.id;
    const groupSchedules =
      await this.groupDashboardService.findGroupSchedules(groupId);

    return groupSchedules.map((groupSchedule) =>
      new GetGroupSchedulesDashboardResponse({
        groupSchedule,
        languageKey: headers.languageKey,
      }).toObject(),
    );
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/schedules/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.viewGroup],
  })
  async getOneGroupSchedule(
    @Headers() headers: IHeaders,
    @Param() params: Params,
    @Query() query: { subjectId: number },
  ) {
    // the params.id = groupId
    this.groupValidation.paramsId({ params });
    this.groupValidation.getAllGroupValidations({ query });

    const groupId = +params.id;
    const subjectId = query.subjectId;

    await this.groupDashboardService.findById(groupId, true);
    await this.subjectService.findOne(subjectId);

    const groupSchedule = await this.groupDashboardService.findOneGroupSchedule(
      groupId,
      subjectId,
    );

    return new GetOneGroupSchedulesDashboardResponse({
      groupSchedule,
      languageKey: headers.languageKey,
    }).toObject();
  }
}
