import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { SupervisorLogMobileService } from '../../service/supervisor-logs-mobile.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Query } from '@nestjs/common';
import { GetSupervisorLogsQuery } from '../dto/request';
import { Types } from 'src/account/user/data/user.schema';
import { SupervisorLogValidation } from '../validation';
import { StudentService } from 'src/university/student/service/student.service';
import { SupervisorService } from 'src/university/supervisor/service/supervisor.service';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { paginationParser } from 'package/pagination/pagination';
import { SupervisorLogFilter } from '../../helper/supervisor-lgs.filter';
import { GetSupervisorLogsResponse } from '../dto/response/get-supervisor-logs';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';

@AuthenticatedController({ controller: '/university/mobile/supervisor-logs' })
export class SupervisorLogMobileController {
  constructor(
    private readonly supervisorLogService: SupervisorLogMobileService,
    private readonly studentService: StudentService,
    private readonly supervisorService: SupervisorService,

    private readonly supervisorLogValidation: SupervisorLogValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.SUPERVISOR],
  })
  async getAll(
    @Query() query: GetSupervisorLogsQuery,
    @User() user: IUser,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.supervisorLogValidation.get({ query });
    const supervisor = await this.supervisorService.findOneById(
      user.supervisor,
    );
    if (query.studentId) {
      await this.studentService.checkSubjectInStudentYear(
        query.studentId,
        supervisor.subjectId,
      );
    }
    const { pagination } = paginationParser(query);
    const filter = new SupervisorLogFilter();
    const logs = await this.supervisorLogService.findAll(
      pagination,
      filter.build(),
    );

    return {
      count: logs.count,
      rows: logs.rows.map(
        (log) => new GetSupervisorLogsResponse({ log, languageKey }),
      ),
    };
  }
}
