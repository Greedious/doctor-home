import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { ChairDashboardService } from '../../service/chair-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import {
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  CreateChairRequest,
  GetChairsQuery,
  LinkStudentToChairRequest,
  UpdateChairRequest,
} from '../dto/request';
import { ChairFilter } from '../../helper/chair.filter';
import { Chair } from '../../data/chair.schema';
import { GetChairsDashboardResponse } from '../dto/response/get-dashboard-chairs';
import { ChairValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { StudentService } from 'src/university/student/service/student.service';
import { AuthorizedStatus } from 'src/shared/decorator/authorized-status.decorator';
import { universityStatus } from 'src/university/status/api/dto/request';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';

@AuthenticatedController({
  controller: '/university/chairs',
})
export class ChairDashboardController {
  constructor(
    private chairDashboardService: ChairDashboardService,
    private subjectService: SubjectService,
    private chairValidation: ChairValidation,
    private studentService: StudentService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.createChair],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getChairs(
    @Query() query: GetChairsQuery,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.chairValidation.get({ query });

    const filters = new ChairFilter()
      // .getSubjectId(query.subjectIds)
      .getSearch(query.search);

    const chairs = await this.chairDashboardService.findAll(filters.build());

    return {
      count: chairs.count,
      rows: chairs.rows.map((chair: Chair) =>
        new GetChairsDashboardResponse({ chair, languageKey }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.createChair],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async getOne(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
    this.chairValidation.paramsId({ params });

    const chair = await this.chairDashboardService.findOne(+params.id);
    return new GetChairsDashboardResponse({ chair, languageKey }).toObject();
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.POST,
    url: 'link-student-to-chair',
    privilege: [universityPrivilegeKeys.createChair],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async linkStudentToChair(
    @Body() body: LinkStudentToChairRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    const { studentsIds, chairId, subjectId } = body;

    //validating the input
    this.chairValidation.linkChairToStudent({ body });

    // fetching the student and chair and making sure they exist
    const students =
      await this.studentService.checkStudentsExistenceAndInSameGroup(
        studentsIds,
      );
    const chair = await this.chairDashboardService.findOne(chairId);
    const subject = await this.subjectService.findOne(subjectId);

    // checking if there is vacant chair for this student

    await this.chairDashboardService.checkEnoughChairCapacityForStudent(
      students.rows,
      chair,
    );
    // linking student to the chair
    const queries: Promise<void>[] = [];
    for (const student of students.rows) {
      queries.push(
        this.chairDashboardService.linkStudentToChair(
          student,
          chair,
          subject,
          transaction,
        ),
      );
    }
    await Promise.all(queries);
    return;
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [universityPrivilegeKeys.createChair],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async createChair(
    @Body() body: CreateChairRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.chairValidation.create({ body });
    await this.subjectService.checkSubjects(body.subjectIds);
    return await this.chairDashboardService.create(body, transaction);
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateChair],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async updateChair(
    @Body() body: UpdateChairRequest,
    @Param() params: Params,
    @TransactionParam() transaction: Transaction,
  ) {
    this.chairValidation.update({ body, params });
    if (body.subjectIds)
      await this.subjectService.checkSubjects(body.subjectIds);
    return await this.chairDashboardService.update(
      body,
      +params.id,
      transaction,
    );
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteStudent],
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  // @AuthorizedStatus({ status: [universityStatus.dateEntryPhase] })
  async deleteChair(@Param() params: Params) {
    this.chairValidation.paramsId({ params });
    return await this.chairDashboardService.delete(params.id);
  }
}
