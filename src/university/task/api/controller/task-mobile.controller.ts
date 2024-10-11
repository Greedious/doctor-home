import { Param } from '@nestjs/common';
import { TaskValidation } from '../validation';
import { MongooseParams } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { TaskMobileService } from '../../service/task-mobile.service';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { Types } from 'src/account/user/data/user.schema';
import { TeacherService } from 'src/university/teacher/service/teacher.service';
import { StudentService } from 'src/university/student/service/student.service';
import { SubjectParams } from '../dto/request';
import { TaskTemplateFilter } from '../../helper/task-template.filter';
import { GetByCriteriaTasksMobileResponse } from '../dto/response/get-all-tasks-mobile.dto';

@AuthenticatedController({
  controller: '/university/mobile/tasks',
})
export class TaskMobileController {
  constructor(
    private readonly taskService: TaskMobileService,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService,
    private readonly taskValidation: TaskValidation,
  ) {}

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    role: [Types.TEACHER, Types.STUDENT],
  })
  async getOne(
    @Headers() { languageKey }: IHeaders,
    @User() user: IUser,
    @Param() params: MongooseParams,
  ) {
    this.taskValidation.paramsId({ params });

    if (user.type.includes(Types.TEACHER)) {
    }
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:subjectId',
    role: [Types.TEACHER, Types.STUDENT],
  })
  async getAllBySubject(
    @Headers() { languageKey }: IHeaders,
    @User() user: IUser,
    @Param() params: SubjectParams,
  ) {
    this.taskValidation.subjectParamsId({ params });
    if (user.teacher) {
      await this.teacherService.checkTeacherTeachingSubject(
        user.teacher,
        params.subjectId,
      );
    }
    if (user.student) {
      await this.studentService.checkSubjectInStudentYear(
        user.student,
        +params.subjectId,
      );
    }
    const filter = new TaskTemplateFilter().getSubject(+params.subjectId);
    const tasks = await this.taskService.findAll(filter.build());
    const notes = await this.taskService.findAll
    return tasks.map(
      (task) => new GetByCriteriaTasksMobileResponse({ task, languageKey }),
    );
  }
}
