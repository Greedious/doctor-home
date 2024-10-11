// import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
// import { SupervisorLogDashboardService } from '../../service/supervisor-logs-dashboard.service';
// import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
// import { Api } from 'package/utils/api-methods';
// import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
// import { Types } from 'src/account/user/data/user.schema';
// import { Body, Param, Query, UsePipes } from '@nestjs/common';
// import {
//   CreateSupervisorLogRequest,
//   GetSupervisorLogsQuery,
//   UpdateSupervisorLogRequest,
// } from '../dto/request';
// import { paginationParser } from 'package/pagination/pagination';
// import { SupervisorLogFilter } from '../../helper/supervisor-lgs.filter';
// import { SupervisorLog } from '../../data/supervisor-lgs.schema';
// import { GetSupervisorLogsResponse } from '../dto/response/get-supervisor-logs';
// import { SupervisorLogValidation } from '../validation';
// import { Params } from 'package/component/params/params';
// import { Headers } from 'package/decorator/param/header.decorator';
// import { IHeaders } from 'package/types/header';

// @AuthenticatedController({
//   controller: '/university/supervisor-logs',
// })
// export class SupervisorLogDashboardController {
//   constructor(
//     private specialtyDashboardService: SupervisorLogDashboardService,
//     private specialtyValidation: SupervisorLogValidation,
//   ) {}

//   @AuthorizedApi({
//     api: Api.GET,
//     url: '/:id',
//     privilege: [universityPrivilegeKeys.viewSupervisorLog],
//     role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
//   })
//   async getOne(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
//     this.specialtyValidation.paramsId({ params });

//     const specialty = await this.specialtyDashboardService.findOne(params);

//     return new GetSupervisorLogsResponse({
//       specialty,
//       languageKey,
//     }).toObject();
//   }

//   @AuthorizedApi({
//     api: Api.GET,
//     url: '',
//     privilege: [universityPrivilegeKeys.viewSupervisorLog],
//     role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
//   })
//   async getSupervisorLogs(
//     @Query() query: GetSupervisorLogsQuery,
//     @Headers() { languageKey }: IHeaders,
//   ) {
//     this.specialtyValidation.get({ query });
//     const { pagination } = paginationParser(query);

//     const filters = new SupervisorLogFilter();
//     if (query.search) filters.getSearch(query.search);

//     const { count, rows } = await this.specialtyDashboardService.findAll(
//       filters.build(),
//       pagination,
//     );

//     return {
//       count,
//       rows: rows.map((specialty: SupervisorLog) =>
//         new GetSupervisorLogsResponse({ specialty, languageKey }).toObject(),
//       ),
//     };
//   }

//   @AuthorizedApi({
//     api: Api.POST,
//     url: '',
//     privilege: [universityPrivilegeKeys.createSupervisorLog],
//     role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
//   })
//   // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
//   async createSupervisorLog(@Body() body: CreateSupervisorLogRequest) {
//     this.specialtyValidation.create({ body });
//     return await this.specialtyDashboardService.create(body);
//   }

//   @AuthorizedApi({
//     api: Api.PATCH,
//     url: '/:id',
//     privilege: [universityPrivilegeKeys.updateSupervisorLog],
//     role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
//   })
//   // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
//   async updateSupervisorLog(
//     @Body() body: UpdateSupervisorLogRequest,
//     @Param() params: Params,
//   ) {
//     this.specialtyValidation.update({ body, params });
//     return await this.specialtyDashboardService.update(body, params.id);
//   }

//   @AuthorizedApi({
//     api: Api.DELETE,
//     url: '/:id',
//     privilege: [universityPrivilegeKeys.deleteSupervisorLog],
//     role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
//   })
//   // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
//   async deleteSupervisorLog(@Param() params: Params) {
//     this.specialtyValidation.paramsId({ params });
//     await this.specialtyDashboardService.canDelete(+params.id);
//     return await this.specialtyDashboardService.delete(params.id);
//   }
// }
