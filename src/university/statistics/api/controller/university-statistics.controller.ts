import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { UniversityStatisticsService } from '../../service/statistics.service';
import { PatientStatus } from 'src/university/patient/data/patient.schema';

@AuthenticatedController({ controller: 'university/statistics' })
export class UniversityStatisticsController {
  constructor(
    private readonly universityStatisticsService: UniversityStatisticsService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/count-statistics',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getCountStatistics() {
    const studentsCount =
      await this.universityStatisticsService.findStudentsCount({});
    const patientsCount =
      await this.universityStatisticsService.findPatientsCount({
        status: PatientStatus.APPROVED,
      });
    const teachersCount =
      await this.universityStatisticsService.findStudentsCount({});
    const appointmentsCount =
      await this.universityStatisticsService.findAppointmentsCount({});
    return {
      studentsCount,
      patientsCount,
      teachersCount,
      appointmentsCount,
    };
  }
}
