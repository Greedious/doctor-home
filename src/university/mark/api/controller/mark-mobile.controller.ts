import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { MarkMobileService } from '../../service/mark-mobile.service';
import { Body, Param } from '@nestjs/common';
import { SetMarkRequest } from '../dto/request';
import { Params } from 'package/component/params/params';
import { MarkValidation } from '../validation';
import { SupervisorService } from 'src/university/supervisor/service/supervisor.service';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { StudentService } from 'src/university/student/service/student.service';

@AuthenticatedController({
  controller: '/university/mobile/marks',
})
export class MarkMobileController {
  constructor(
    private readonly markMobileService: MarkMobileService,
    private readonly markValidation: MarkValidation,
    private readonly supervisorService: SupervisorService,
    private readonly subjectService: SubjectService,
    private readonly studentService: StudentService,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/:id',
    role: [Types.SUPERVISOR],
    // privilege: [universityPrivilegeKeys.updateStudent],
  })
  async setMark(
    @Body() body: SetMarkRequest,
    @Param() params: Params,
    @User() user: IUser,
  ) {
    this.markValidation.setMark({ body });
    this.markValidation.paramsId({ params });

    const supervisor = await this.supervisorService.findOneById(
      user.supervisor,
    );

    const subject = await this.subjectService.findOne(supervisor.subjectId);
    await this.studentService.checkSubjectInStudentYear(+params.id, subject.id);

    const mark = await this.markMobileService.setMark({
      mark: body.mark,
      studentId: +params.id,
      subjectId: subject.id,
    });

    return { id: mark.id };
  }
}
