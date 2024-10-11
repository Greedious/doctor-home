import { Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { PatientMobileService } from '../../service/patient-mobile.service';
import { PatientValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByIdPatientMobileResponse } from '../dto/response/get-by-id-mobile-patient.dto';
import { paginationParser } from 'package/pagination/pagination';
import { GetByCriteriaPatientMobileResponse } from '../dto/response/get-all-patients-mobile.dto';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import {
  CreatePatientRequest,
  GetAllPatientsMobileQuery,
  UpdatePatientRequest,
} from '../dto/request';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { PatientFilterObject } from '../../helper/patient-filter';
import { ImageService } from 'src/image/service/image.service';
import { StudentService } from 'src/university/student/service/student.service';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { TeacherService } from 'src/university/teacher/service/teacher.service';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { TaskService } from 'src/university/task/service/task.service';
import { RequestPatientService } from 'src/university/request-patient/service/request-patient.service';
import { DoctorService } from 'src/account/doctor/service/doctor.service';

@AuthenticatedController({ controller: '/university/mobile/patients' })
export class PatientMobileController {
  constructor(
    private readonly patientService: PatientMobileService,
    private readonly requestPatientService: RequestPatientService,
    private readonly patientValidation: PatientValidation,
    private readonly imageService: ImageService,
    private readonly subjectService: SubjectService,
    private readonly taskService: TaskService,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService,
    private readonly doctorService: DoctorService,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.STUDENT, Types.TEACHER, Types.SUPERVISOR],
  })
  async findAll(
    @Query() query: GetAllPatientsMobileQuery,
    @User() user: IUser,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.patientValidation.getAllMobile({ query });

    const { pagination } = paginationParser(query);
    const filter = new PatientFilterObject()
      .search(query.search)
      .getStudent(user.student)
      .teacherFilters(user.teacher);

    if (user.teacher) {
      const subjects = await this.teacherService.getSubjects(user.teacher);
      filter.getSubjects(
        subjects.map((teacherSubject) => teacherSubject.subjectId),
      );
    }
    if (user.supervisor) {
      const supervisor = await this.doctorService.findSupervisorDoctor(
        user.doctor,
      );
      filter.getSubjects([supervisor.subjectId]);
    }

    const patients = await this.patientService.findAll(
      filter.build(),
      pagination,
    );

    return {
      count: patients.count,
      rows: patients.rows.map((patient) =>
        new GetByCriteriaPatientMobileResponse({
          patient,
          languageKey,
        }).toObject(),
      ),
    };
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.POST,
    url: '/',
    role: [Types.STUDENT, Types.TEACHER],
  })
  async createPatient(
    @Body() body: CreatePatientRequest,
    @User() user: IUser,
    @TransactionParam() transaction: Transaction,
  ) {
    // validating the body
    this.patientValidation.create({ body, user });

    // validating the attachments existence
    if (body.attachmentsIds.length)
      this.imageService.checkImages(body.attachmentsIds);

    // validating the subject existence
    const subject = await this.subjectService.findOne(body.subjectId);

    if (user.teacher) {
      const teacher = await this.teacherService.findOneById(user.teacher);
      // validating that the teacher is teaching the subject
      await this.teacherService.checkTeacherTeachingSubject(
        teacher.id,
        subject.id,
      );
      body.teacherId = teacher.id;
    }

    await this.taskService.checkTaskTemplate(body.subjectId, body.task);
    if (body.studentId || user.student) {
      const studentId = body.studentId || user.student;
      const student = await this.studentService.findOne(studentId);
      // validating if the student has the provided subject in the year he is studying
      await this.studentService.checkSubjectInStudentYear(
        student.id,
        subject.id,
      );
      body.studentId = studentId;
    } else {
      const student = await this.requestPatientService.findSuitableStudent({
        subjectId: body.subjectId,
        task: body.task,
      });
      if (!student) return;
      body.studentId = student;
    }

    const patient = await this.patientService.create(body, transaction);
    return { id: patient.id };
  }

  @UseInterceptors(TransactionInterceptor)
  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    role: [Types.STUDENT, Types.TEACHER],
  })
  async updatePatient(
    @Body() body: UpdatePatientRequest,
    @Param() params: Params,
    @User() user: IUser,
    @TransactionParam() transaction: Transaction,
  ) {
    // validating the body
    this.patientValidation.update({ body, params, user });

    // validating the attachments existence
    if (body.attachmentsIds?.length)
      this.imageService.checkImages(body.attachmentsIds);

    // validating the subject existence
    if (body.subjectId) {
      const subject = await this.subjectService.findOne(body.subjectId);

      const studentId = user.student;
      const student = await this.studentService.findOne(studentId);

      // validating if the student has the provided subject in the year he is studying
      await this.studentService.checkSubjectInStudentYear(
        student.id,
        subject.id,
      );

      await this.taskService.checkTaskTemplate(body.subjectId, body.task);
    }

    await this.patientService.update(body, user, +params.id, transaction);
    return;
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.STUDENT, Types.TEACHER],
  })
  async findOne(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
    this.patientValidation.paramsId({ params });
    const patient = await this.patientService.findOne(params);
    return new GetByIdPatientMobileResponse({ patient, languageKey });
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    role: [Types.STUDENT],
  })
  async delete(@Param() params: Params, @User() user: IUser) {
    this.patientValidation.paramsId({ params });
    await this.patientService.delete(+params.id, user);
    return;
  }
}
