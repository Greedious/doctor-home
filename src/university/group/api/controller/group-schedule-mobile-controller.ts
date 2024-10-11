import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { GroupMobileService } from '../../service/group-mobile.service';
import { Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetUserScheduleResponse } from 'src/university/chair/api/dto/response/get-user-schedule';
import { Params } from 'package/component/params/params';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { GroupValidation } from '../validation';
import { GroupError } from '../../service/group-error.service';

@AuthenticatedController({
  controller: '/mobile/group-schedule',
})
export class GroupScheduleMobileController {
  constructor(
    private readonly groupService: GroupMobileService,
    private readonly subjectService: SubjectService,
    private readonly groupValidation: GroupValidation,
    private readonly groupError: GroupError,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.STUDENT],
  })
  async getStudentSchedule(@Headers() headers: IHeaders, @User() user: IUser) {
    const schedule = await this.groupService.findStudentSchedule(user);
    return schedule.chairs.map((chair) =>
      new GetUserScheduleResponse({
        chairStudent: chair,
        languageKey: headers.languageKey,
      }).toObject(),
    );
  }
  @AuthorizedApi({
    api: Api.GET,
    url: '/subject/:id',
    role: [Types.STUDENT],
  })
  async getSubjectSchedule(
    @Headers() headers: IHeaders,
    @User() user: IUser,
    @Param() params: Params,
  ) {
    this.groupValidation.paramsId({ params });
    await this.subjectService.findOne(+params.id);
    const schedule = await this.groupService.findStudentScheduleBySubjectId(
      user,
      params,
    );
    if (!schedule.chairs.length) {
      throw new HttpException(
        this.groupError.notFoundGroupSchedule(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return new GetUserScheduleResponse({
      chairStudent: schedule.chairs[0],
      languageKey: headers.languageKey,
    }).toObject();
  }
}
