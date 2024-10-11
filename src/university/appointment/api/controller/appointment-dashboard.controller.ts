import { Body, Param, Query, UsePipes } from '@nestjs/common';
import {
  CreateAppointmentRequest,
  GetAllAppointments,
  UpdateAppointment,
} from '../dto/request';
import { AppointmentValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { GetByIdAppointmentDashboardResponse } from '../dto/response/get-by-id-appointment-dashboard.dto';
import { AppointmentDashboardService } from '../../service/appointment-dashboard.service';

@AuthenticatedController({
  controller: '/university/appointments',
})
export class AppointmentDashboardController {
  constructor(
    private readonly appointmentService: AppointmentDashboardService,
    private readonly appointmentValidation: AppointmentValidation,
  ) {}

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateAppointment],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async update(@Body() body: UpdateAppointment, @Param() params: Params) {
    this.appointmentValidation.update({ body, params });
    await this.appointmentService.findOneById(params.id);
    return await this.appointmentService.update(body, +params.id);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.viewAppointment],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.appointmentValidation.paramsId({ params });
    const appointment = await this.appointmentService.findOne(params);
    return new GetByIdAppointmentDashboardResponse({
      appointment,
      languageKey,
    }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.viewAppointment],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async getAll(
    @Headers() header: IHeaders,
    @Query() query: GetAllAppointments,
  ) {
    this.appointmentValidation.getAll({ query });
    const ads = await this.appointmentService.findAll();
    // return {
    //   rows: ads.map((appointment) =>
    //     new GetByCriteriaAppointmentsDashboardResponse({
    //       appointment: appointment,
    //       languageKey: header.languageKey,
    //     }).,
    //   ),
    // };
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteAppointment],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async delete(@Param() params: Params) {
    this.appointmentValidation.paramsId({ params });
    await this.appointmentService.findOneById(params.id);
    await this.appointmentService.delete(+params.id);
    return;
  }
}
