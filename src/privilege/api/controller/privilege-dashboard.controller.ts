import { Controller, Get, Query } from '@nestjs/common';
import { PrivilegeDashboardService } from 'src/privilege/service/privilege-dashboard.service';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteria } from 'package/pagination/dto';
import { PrivilegeValidation } from '../validation';
import { paginationParser } from 'package/pagination/pagination';
import { GetAllPrivilegeDashboardResponse } from '../dto/response/get-all.dto';
import { GetPrivilegesCriteria } from '../dto/request';

@Controller('/privileges')
export class PrivilegeDashboardController {
  constructor(
    private readonly privilegeService: PrivilegeDashboardService,
    private readonly privilegeValidation: PrivilegeValidation,
  ) {}

  @Get('')
  async getAll(
    @Headers() header: IHeaders,
    @Query() query: GetPrivilegesCriteria,
  ) {
    this.privilegeValidation.getAll({ query });

    const { pagination, criteria } = paginationParser(query);
    const { rows, count } = await this.privilegeService.findAll({
      ...pagination,
      type: criteria.type,
    });

    return {
      count,
      rows: rows.map((privilege) =>
        new GetAllPrivilegeDashboardResponse({
          privilege,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  //todo implement this when user table is ready
  // @Delete('/:id')
  // async delete(@Param() params: Params) {
  //   this.privilegeValidation.paramsId({ params });

  //   return await this.privilegeService.findOneById()
  // }
}
