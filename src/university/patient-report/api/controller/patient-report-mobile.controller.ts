import { Body, Param, Query, UseInterceptors } from '@nestjs/common';

import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { CreatePatientReport } from '../dto/request';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { PatientReportValidation } from '../validation';
import { PatientReportMobileService } from '../../service/patient-report-mobile.service';
import { PatientService } from 'src/university/patient/service/patient.service';
import { AppointmentService } from 'src/university/appointment/service/appointment.service';
import { Appointment } from 'src/university/appointment/data/appointment.schema';
import { Params } from 'package/component/params/params';

@AuthenticatedController({ controller: '/university/mobile/patients-reports' })
export class PatientReportMobileController {
  constructor(
    private readonly patientReportValidation: PatientReportValidation,
    private readonly patientReportMobileService: PatientReportMobileService,
    private readonly appointmentService: AppointmentService,
    private readonly patientService: PatientService,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Types.TEACHER],
  })
  async create(@Body() body: CreatePatientReport, @User() user: IUser) {
    this.patientReportValidation.create({ body });

    const appointment = await this.appointmentService.findOne(
      body.appointmentId,
      true,
    );

    await this.patientService.findOne(appointment.patientId);
    const report = await this.patientReportMobileService.createReport({
      body,
      patientId: appointment.patientId,
    });
    return { id: report.id };
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '',
    role: [Types.TEACHER],
  })
  async update(
    @Body() body: CreatePatientReport,
    @Param() params: Params,
    @User() user: IUser,
  ) {
    this.patientReportValidation.update({ body });
    this.patientReportValidation.paramsId({ params });

    let appointment: null | Appointment = null;
    if (body.appointmentId) {
      appointment = await this.appointmentService.findOne(body.appointmentId);
    }

    const report = await this.patientReportMobileService.updateReport({
      body,
      id: params.id,
      patientId: appointment?.patientId,
    });
    return { id: report.id };
  }
}
