import { Query } from '@nestjs/common';
import { GetAllPatientsDashboardQuery } from '../dto/request';
import { PatientValidation } from '../validation';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { paginationParser } from 'package/pagination/pagination';
import { PatientDashboardService } from '../../service/patient-dashboard.service';
import { PatientFilterObject } from '../../helper/patient-filter';
import { Types } from 'src/account/user/data/user.schema';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
@AuthenticatedController({ controller: '/university/patients' })
export class PatientController {
  constructor(
    private readonly patientService: PatientDashboardService,
    private readonly patientValidation: PatientValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/unique',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.viewPatient],
  })
  async getUniquePatients(@Query() query: GetAllPatientsDashboardQuery) {
    this.patientValidation.getAll({ query });
    const filter = new PatientFilterObject().search(query.search);
    const { pagination } = paginationParser(query);
    const patients = await this.patientService.findUniquePatients({
      filter: filter.build(),
      skip: pagination.skip,
      limit: pagination.limit,
    });
    return patients.map((patient, index) => {
      return {
        id: index + 1,
        nationalId: patient.nationalId,
        name: patient.name,
      };
    });
  }
  //   @AuthorizedApi({
  //     api: Api.POST,
  //     url: '',
  //     role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  //     privilege: [universityPrivilegeKeys.createSubject],
  //   })
  //   //@AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  //   async create(@Body() body: CreateSubjectRequest) {
  //     this.subjectValidation.create({ body });
  //     if (body.yearId) await this.yearService.checkYear(body.yearId);
  //     return await this.subjectService.create(body);
  //   }

  //   @AuthorizedApi({
  //     api: Api.PATCH,
  //     url: '/:id',
  //     role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  //     privilege: [universityPrivilegeKeys.updateSubject],
  //   })
  //   @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  //   async update(@Body() body: UpdateSubjectRequest, @Param() params: Params) {
  //     this.subjectValidation.update({ body });
  //     this.subjectValidation.paramsId({ params });
  //     if (body.yearId) await this.yearService.checkYear(body.yearId);
  //     return await this.subjectService.update(body, params);
  //   }

  //   @AuthorizedApi({
  //     api: Api.GET,
  //     url: '/:id',
  //     role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  //     privilege: [universityPrivilegeKeys.viewSubject],
  //   })
  //   async getOne(@Headers() header: IHeaders, @Param() params: Params) {
  //     this.subjectValidation.paramsId({ params });
  //     const subject = await this.subjectService.findOneById(+params.id);
  //     return new GetByCriteriaSubjectResponse({
  //       subject,
  //       languageKey: header.languageKey,
  //     }).toObject();
  //   }

  //   @AuthorizedApi({
  //     api: Api.GET,
  //     url: '',
  //     role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  //     privilege: [universityPrivilegeKeys.viewSubject],
  //   })
  //   async getAll(
  //     @Headers() header: IHeaders,
  //     @Query() query: GetAllSubjectQuery,
  //   ) {
  //     this.subjectValidation.getAll({ query });
  //     const { pagination } = paginationParser(query);
  //     const filter = new SubjectFilterObject()
  //       .getSeason(query.season)
  //       .getYear(query.year)
  //       .getSearch(query.search);

  //     const subjects = await this.subjectService.findAll(
  //       filter.build(),
  //       pagination,
  //     );
  //     return {
  //       count: subjects.count,
  //       rows: subjects.rows.map((subject) =>
  //         new GetByCriteriaSubjectResponse({
  //           subject,
  //           languageKey: header.languageKey,
  //         }).toObject(),
  //       ),
  //     };
  //   }

  //   @AuthorizedApi({
  //     api: Api.DELETE,
  //     url: '',
  //     role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  //     privilege: [universityPrivilegeKeys.deleteSubject],
  //   })
  //   @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  //   async delete(@Param() params: Params) {
  //     this.subjectValidation.paramsId({ params });
  //     await this.subjectService.findOneById(params.id);
  //     await this.subjectService.delete(params);
  //     return;
  //   }
}
