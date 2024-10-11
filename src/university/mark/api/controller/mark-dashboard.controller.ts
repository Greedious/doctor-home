import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { MarkDashboardService } from '../../service/mark-dashboard.service';
import { MarkValidation } from '../validation';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Header, Param } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { StudentService } from 'src/university/student/service/student.service';
import { Mark } from '../../data/mark.schema';
import { GetMarksDashboardResponse } from '../dto/response/get-marks.dto';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';

@AuthenticatedController({
  controller: '/university/marks',
})
export class MarkDashboardController {
  constructor(
    private readonly markDashboardService: MarkDashboardService,
    private readonly markValidation: MarkValidation,
    private readonly studentService: StudentService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
    privilege: [universityPrivilegeKeys.viewMark],
  })
  async get(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
    this.markValidation.paramsId({ params });

    const studentId = +params.id;
    await this.studentService.findOne(studentId);

    const { count, rows } =
      await this.markDashboardService.findMarks(studentId);

    return {
      count,
      rows: rows.map(
        (mark: Mark) => new GetMarksDashboardResponse({ languageKey, mark }),
      ),
    };
  }
}
