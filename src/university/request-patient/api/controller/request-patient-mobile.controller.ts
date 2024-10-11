import { Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { RequestPatientMobileService } from '../../service/request-patient-mobile.service';
import { RequestPatientValidation } from '../validation';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { RequestPatient } from '../dto/request';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { ImageService } from 'src/image/service/image.service';
import { StudentService } from 'src/university/student/service/student.service';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { TeacherService } from 'src/university/teacher/service/teacher.service';
import { TaskService } from 'src/university/task/service/task.service';

@AuthenticatedController({ controller: '/university/mobile/request-patients' })
export class RequestPatientMobileController {
  constructor(
    private readonly requestPatientService: RequestPatientMobileService,
    private readonly requestPatientValidation: RequestPatientValidation,
    private readonly subjectService: SubjectService,
    private readonly taskService: TaskService,
    private readonly studentService: StudentService,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Types.STUDENT],
  })
  async create(
    @Body() body: RequestPatient,
    @User() user: IUser,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.requestPatientValidation.create({ body });
    const student = await this.studentService.findOne(user.student);
    await this.subjectService.subjectsInYear(student.yearId);
    await this.taskService.checkTaskTemplate(body.subjectId, body.task);
    return await this.requestPatientService.create(body, user);
  }
}
