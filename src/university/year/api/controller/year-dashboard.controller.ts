import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { YearDashboardService } from '../../service/year-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import {
  Body,
  Inject,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
  forwardRef,
} from '@nestjs/common';
import {
  CreateYearRequest,
  GetYearsQuery,
  UpdateYearRequest,
} from '../dto/request';
import { YearFilter } from '../../helper/year.filter';
import { Year } from '../../data/year.schema';
import { GetYearsDashboardResponse } from '../dto/response/get-dashboard-years';
import { YearValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { GetOneYearDashboardResponse } from '../dto/response/get-one-dashboard-years';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GroupService } from 'src/university/group/service/group.service';
import { AuthorizedStatus } from 'src/shared/decorator/authorized-status.decorator';
import { universityStatus } from 'src/university/status/api/dto/request';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';

@AuthenticatedController({
  controller: '/university/years',
})
export class YearDashboardController {
  constructor(
    private readonly yearDashboardService: YearDashboardService,
    private readonly yearValidation: YearValidation,
    private readonly groupService: GroupService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.createYear],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getOne(@Param() params: Params) {
    this.yearValidation.paramsId({ params });

    const year = await this.yearDashboardService.findOne(+params.id);

    return new GetOneYearDashboardResponse({ year }).toObject();
  }
  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.createYear],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getYears(
    @Query() query: GetYearsQuery,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.yearValidation.get({ query });

    const filters = new YearFilter();
    if (query.search) filters.getSearch(query.search);

    const years = await this.yearDashboardService.findAll(filters.build());

    return years.map((year: Year) =>
      new GetYearsDashboardResponse({ year, languageKey }).toObject(),
    );
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [universityPrivilegeKeys.createYear],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async createYear(
    @Body() body: CreateYearRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.yearValidation.create({ body });

    const { groupsIds } = body;
    for (const id of groupsIds) {
      await this.groupService.findById(id, true);
    }

    return await this.yearDashboardService.create(body, transaction);
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateYear],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async updateYear(
    @Body() body: UpdateYearRequest,
    @Param() params: Params,
    @TransactionParam() transaction: Transaction,
  ) {
    this.yearValidation.update({ body, params });

    const { groupsIds } = body;
    for (const id of groupsIds) {
      await this.groupService.findById(id, true);
    }

    await this.yearDashboardService.update(body, +params.id, transaction);
    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteStudent],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async deleteYear(@Param() params: Params) {
    this.yearValidation.paramsId({ params });
    return await this.yearDashboardService.delete(params.id);
  }
}
