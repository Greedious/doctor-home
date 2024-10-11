import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { TeacherDashboardService } from '../../service/teacher-dashboard.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Body, Param, Query } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { GroupService } from 'src/university/group/service/group.service';
import {
  AddGroupTeacherRequest,
  AssignSubjectRequest,
  DeleteGroupTeacherRequest,
  DeleteSubjectTeacherRequest,
} from '../dto/request';
import { TeacherValidation } from '../validation';
import { GetTeacherSubjects } from '../dto/response/get-teacher-subjects';
import { GetOneTeacherSubject } from '../dto/response/get-one-teacher-subject';

@AuthenticatedController({
  controller: '/university/teacher-subject',
})
export class TeacherSubjectController {
  constructor(
    private readonly teacherService: TeacherDashboardService,
    private readonly teacherValidation: TeacherValidation,
    private readonly subjectService: SubjectService,
    private readonly groupService: GroupService,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.createTeacher],
  })
  async create(
    @Param() params: Params,
    @Body() body: AssignSubjectRequest,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.teacherValidation.assignSubject({ body, params });

    await this.teacherService.findOne(+params.id);

    const subject = await this.subjectService.findOne(body.subjectId);

    await this.groupService.checkGroups(body.groups, subject.yearId);
    await this.teacherService.checkIfNotAssignedSubject(
      +params.id,
      body.subjectId,
    );

    await this.teacherService.assignSubject(body, +params.id);
    return;
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/group/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.deleteTeacher],
  })
  async addGroup(
    @Param() params: Params,
    @Body() body: AddGroupTeacherRequest,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.teacherValidation.addGroupTeacher({ params, body });
    const subject = await this.subjectService.findOne(body.subjectId);
    await this.groupService.checkGroup(body.groupId, subject.yearId);
    const teacherSubject = await this.teacherService.checkIfAssigned(
      +params.id,
      body.subjectId,
    );
    await this.teacherService.createSubjectGroup(
      teacherSubject.id,
      body.groupId,
    );
    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.deleteTeacher],
  })
  async delete(
    @Param() params: Params,
    @Body() body: DeleteSubjectTeacherRequest,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.teacherValidation.deleteSubject({ params, body });
    await this.teacherService.findOne(+params.id);
    await this.subjectService.findOne(+body.subjectId);
    await this.teacherService.deleteSubject(+params.id, body.subjectId);
    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/group/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [universityPrivilegeKeys.deleteTeacher],
  })
  async deleteGroup(
    @Param() params: Params,
    @Body() body: DeleteGroupTeacherRequest,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.teacherValidation.deleteGroupTeacher({ params, body });
    const subject = await this.subjectService.findOne(body.subjectId);
    await this.groupService.checkGroup(body.groupId, subject.yearId);
    const teacherSubject = await this.teacherService.checkIfAssigned(
      +params.id,
      body.subjectId,
    );
    await this.teacherService.deleteSubjectGroup(
      teacherSubject.id,
      body.groupId,
    );
    return;
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [
      universityPrivilegeKeys.viewSubject,
      universityPrivilegeKeys.viewTeacher,
    ],
  })
  async getTeacherSubjects(
    @Headers() headers: IHeaders,
    @Param() params: Params,
  ) {
    this.teacherValidation.paramsId({ params });
    await this.teacherService.findOne(+params.id);

    const subjects = await this.teacherService.findTeacherSubjects(+params.id);

    return subjects.map((teacherSubject) =>
      new GetTeacherSubjects({
        teacherSubject,
        languageKey: headers.languageKey,
      }).toObject(),
    );
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/groups/:teacherId/:subjectId',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [
      universityPrivilegeKeys.viewSubject,
      universityPrivilegeKeys.viewTeacher,
    ],
  })
  async getTeacherSubject(
    @Headers() headers: IHeaders,
    @Param() params: { teacherId: number; subjectId: number },
  ) {
    const teacherId = +params.teacherId;
    const subjectId = +params.subjectId;
    await this.teacherValidation.getOneTeacherSubjectParams({ params });
    await this.teacherValidation.getTeacherSubject({ query: { subjectId } });
    const teacherSubject = await this.teacherService.findOneTeacherSubject(
      teacherId,
      subjectId,
    );

    return new GetOneTeacherSubject({
      teacherSubject,
      languageKey: headers.languageKey,
    }).toObject();
  }
}
