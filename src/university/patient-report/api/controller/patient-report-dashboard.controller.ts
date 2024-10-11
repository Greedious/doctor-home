import {
  Body,
  Get,
  Header,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SubjectDashboardService } from 'src/university/subject/service/subject-dashboard.service';

import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { SubjectFilterObject } from 'src/university/subject/helper/subject-filter';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { PatientReportDashboardService } from '../../service/patient-report-dashboard.service';
import { Type } from 'class-transformer';
import { PatientReportValidation } from '../validation';
import { GetPatientReportsDashboardResponse } from '../dto/response/get-patient-reports.dto';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';

@AuthenticatedController({ controller: '/university/patients-reports' })
export class PatientReportDashboardController {
  constructor(
    private readonly patientReportService: PatientReportDashboardService,
    private readonly patientReportValidation: PatientReportValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:nationalId',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.viewPatient],
  })
  async getReports(
    @Headers() headers: IHeaders,
    @Param() params: { nationalId: string },
  ) {
    this.patientReportValidation.getReport({ params });
    const reports = await this.patientReportService.findPatientReport(
      params.nationalId,
    );
    if (reports.length === 0) {
      return [];
    }
    return {
      patientName: reports[0].name,
      patientAge: reports[0].age,
      reports: reports.map(
        (report) =>
          new GetPatientReportsDashboardResponse({
            report,
            languageKey: headers.languageKey,
          }),
      ),
    };
  }
}
