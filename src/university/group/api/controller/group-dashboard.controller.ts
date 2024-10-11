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
  CreateGroupRequest,
  GetAllGroup,
  UpdateGroupRequest,
} from '../dto/request';
import { IHeaders } from 'package/types/header';
import { Headers } from 'package/decorator/param/header.decorator';
import { paginationParser } from 'package/pagination/pagination';
import { GetGroupDashboardResponse } from '../dto/response/get-group-dashboard.response';
import { YearService } from 'src/university/year/service/year.service';
import { GetOneGroupDashboardResponse } from '../dto/response/get-one-group.dto';

@AuthenticatedController({
  controller: '/university/groups',
})
export class GroupDashboardController {
  constructor(
    private readonly groupDashboardService: GroupDashboardService,
    private readonly groupValidation: GroupValidation,
    private readonly yearService: YearService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.createGroup],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getAll(
    @Query() query: GetAllGroup,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.groupValidation.getAll({ query });
    const { pagination } = paginationParser(query);
    const groups = await this.groupDashboardService.findAll({}, pagination);
    return {
      count: groups.count,
      rows: groups.rows.map((group) => {
        return new GetGroupDashboardResponse({ group, languageKey }).toObject();
      }),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.viewGroup],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.groupValidation.paramsId({ params });
    const group = await this.groupDashboardService.findOne(+params.id);
    return new GetOneGroupDashboardResponse({ group, languageKey });
  }

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [universityPrivilegeKeys.createGroup],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async createGroup(@Body() body: CreateGroupRequest) {
    this.groupValidation.create({ body });
    await this.yearService.checkYear(body.yearId);
    return this.groupDashboardService.create(body, body.yearId);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateGroup],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async updateGroup(@Param() params: Params, @Body() body: UpdateGroupRequest) {
    this.groupValidation.update({ body, params });
    await this.groupDashboardService.update(body, +params.id);
    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteGroup],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async deleteGroup(@Param() params: Params) {
    this.groupValidation.paramsId({ params });
    return this.groupDashboardService.delete(+params.id);
  }
}
