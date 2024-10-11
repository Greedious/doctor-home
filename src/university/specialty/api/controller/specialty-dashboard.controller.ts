import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { SpecialtyDashboardService } from '../../service/specialty-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { Body, Param, Query, UsePipes } from '@nestjs/common';
import {
  CreateSpecialtyRequest,
  GetSpecialtiesQuery,
  UpdateSpecialtyRequest,
} from '../dto/request';
import { paginationParser } from 'package/pagination/pagination';
import { SpecialtyFilter } from '../../helper/specialty.filter';
import { Specialty } from '../../data/specialty.schema';
import { GetSpecialtiesResponse } from '../dto/response/get-specialties';
import { SpecialtyValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthorizedStatus } from 'src/shared/decorator/authorized-status.decorator';
import { universityStatus } from 'src/university/status/api/dto/request';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';

@AuthenticatedController({
  controller: '/university/specialties',
})
export class SpecialtyDashboardController {
  constructor(
    private specialtyDashboardService: SpecialtyDashboardService,
    private specialtyValidation: SpecialtyValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.viewSpecialty],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getOne(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
    this.specialtyValidation.paramsId({ params });

    const specialty = await this.specialtyDashboardService.findOne(params);

    return new GetSpecialtiesResponse({
      specialty,
      languageKey,
    }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.viewSpecialty],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getSpecialties(
    @Query() query: GetSpecialtiesQuery,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.specialtyValidation.get({ query });
    const { pagination } = paginationParser(query);

    const filters = new SpecialtyFilter();
    if (query.search) filters.getSearch(query.search);

    const { count, rows } = await this.specialtyDashboardService.findAll(
      filters.build(),
      pagination,
    );

    return {
      count,
      rows: rows.map((specialty: Specialty) =>
        new GetSpecialtiesResponse({ specialty, languageKey }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [universityPrivilegeKeys.createSpecialty],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async createSpecialty(@Body() body: CreateSpecialtyRequest) {
    this.specialtyValidation.create({ body });
    return await this.specialtyDashboardService.create(body);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateSpecialty],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async updateSpecialty(
    @Body() body: UpdateSpecialtyRequest,
    @Param() params: Params,
  ) {
    this.specialtyValidation.update({ body, params });
    return await this.specialtyDashboardService.update(body, params.id);
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteSpecialty],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async deleteSpecialty(@Param() params: Params) {
    this.specialtyValidation.paramsId({ params });
    await this.specialtyDashboardService.canDelete(+params.id);
    return await this.specialtyDashboardService.delete(params.id);
  }
}
