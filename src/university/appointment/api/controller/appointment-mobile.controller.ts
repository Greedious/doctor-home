import { Body, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import {
  CreateAppointmentRequest,
  GetAllAppointments,
  GetOneAppointment,
} from '../dto/request';
import { AppointmentValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteriaAppointmentsMobileResponse } from '../dto/response/get-all-appointments-mobile.dto';
import { GetByIdAppointmentMobileResponse } from '../dto/response/get-by-id-appointment-mobile.dto';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { Types } from 'src/account/user/data/user.schema';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { AppointmentMobileService } from '../../service/appointment-mobile.service';
import { ChairService } from 'src/university/chair/service/chair.service';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { StudentService } from 'src/university/student/service/student.service';
import { TeacherService } from 'src/university/teacher/service/teacher.service';
import { AppointmentFilterObject } from '../../helper/appointment-filter';
import { paginationParser } from 'package/pagination/pagination';
import { GetNonAvailableDatesMobileResponse } from '../dto/response/get-available-dates-mobile.dto copy';
import { GetNonAvailableDatesRequest } from 'src/university/subject/api/dto/request';
import { GroupService } from 'src/university/group/service/group.service';
import { GetUserScheduleResponse } from 'src/university/chair/api/dto/response/get-user-schedule';
import { GroupError } from 'src/university/group/service/group-error.service';
import { GroupScheduleFilterObject } from 'src/university/group/helper/group-schedule-filter';
import { PatientService } from 'src/university/patient/service/patient.service';
import { DoctorService } from 'src/account/doctor/service/doctor.service';
import { SupervisorService } from 'src/university/supervisor/service/supervisor.service';

@AuthenticatedController({
  controller: '/university/mobile/appointments',
})
export class AppointmentMobileController {
  constructor(
    private readonly appointmentService: AppointmentMobileService,
    private readonly chairService: ChairService,
    private readonly patientService: PatientService,
    private readonly studentService: StudentService,
    private readonly subjectService: SubjectService,
    private readonly teacherService: TeacherService,
    private readonly groupService: GroupService,
    private readonly groupError: GroupError,
    private readonly appointmentValidation: AppointmentValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [],
    role: [Types.STUDENT],
  })
  async create(@Body() body: CreateAppointmentRequest, @User() user: IUser) {
    this.appointmentValidation.create({ body });
    if (body.patientId) {
      await this.patientService.getMyPatientById(body.patientId, user.student);
    }
    await this.subjectService.findOne(body.subjectId);
    const student = await this.studentService.findOne(user.student);
    const chair = await this.chairService.getChairByStudentAndSubject(
      user.student,
      body.subjectId,
    );
    body.chairId = chair.chairId;

    await this.appointmentService.validateDate(body, student.groupId);

    return await this.appointmentService.create(body, user);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.STUDENT, Types.TEACHER],
  })
  async getOne(
    @Headers() { languageKey }: IHeaders,
    @Param() params: Params,
    @Query() query: GetOneAppointment,
    @User() user: IUser,
  ) {
    this.appointmentValidation.getOneAppointment({ params, query, user });
    const appointment = await this.appointmentService.findOne(
      params,
      query.studentId || user.student,
    );
    if (user.teacher) {
      await this.teacherService.checkTeacherTeachingSubject(
        user.teacher,
        appointment.subjectId,
      );
    }
    return new GetByIdAppointmentMobileResponse({
      appointment,
      languageKey,
    }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/subjects/:id',
    role: [Types.STUDENT],
  })
  async getNonAvailableDatesForChair(
    @Headers() header: IHeaders,
    @Param() params: Params,
    @Query() query: GetNonAvailableDatesRequest,
    @User() user: IUser,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.appointmentValidation.getAllNonAvailable({ params, query });
    const appointmentFilter = new AppointmentFilterObject().sameDay(query.date);
    const groupScheduleFilter = new GroupScheduleFilterObject().sameDay(
      query.date,
    );
    await this.subjectService.findOne(+params.id);
    const chair = await this.chairService.getChairByStudentAndSubject(
      user.student,
      +params.id,
    );

    const schedule = await this.groupService.findStudentScheduleBySubjectId(
      user,
      params,
      groupScheduleFilter.build(),
    );
    const appointments =
      await this.appointmentService.getNonAvailableDatesForChair(
        appointmentFilter.build(),
        {
          chairId: chair.id,
          subjectId: +params.id,
        },
      );
    if (!schedule.chairs?.length) {
      throw new HttpException(
        this.groupError.notFoundGroupSchedule(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      schedule: new GetUserScheduleResponse({
        chairStudent: schedule.chairs[0],
        languageKey,
      }).toObject(),
      appointments: appointments.map((appointment) =>
        new GetNonAvailableDatesMobileResponse({
          appointment,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.TEACHER, Types.STUDENT],
  })
  async getAll(
    @Headers() header: IHeaders,
    @Query() query: GetAllAppointments,
    @User() user: IUser,
  ) {
    this.appointmentValidation.getAll({ query });
    const { pagination } = paginationParser(query);
    const filter = new AppointmentFilterObject().pastOrCurrent(query.past);
    if (user.teacher) {
      const subjects = await this.teacherService.getSubjects(user.teacher);
      filter.getSubjects(subjects.map((subject) => subject.id));
    }
    if (user.student) {
      filter.getStudent(user.student);
    }
    const appointments = await this.appointmentService.findAll(
      filter.build(),
      pagination,
    );
    return {
      count: appointments.count,
      rows: appointments.rows.map((appointment) =>
        new GetByCriteriaAppointmentsMobileResponse({
          appointment,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  // @AuthorizedApi({
  //   api: Api.GET,
  //   url: '/get-supervisor-appointments',
  //   role: [Types.SUPERVISOR],
  // })
  // async getAllForSupervisor(
  //   @Headers() header: IHeaders,
  //   @Query() query: GetAllAppointments,
  //   @User() user: IUser,
  // ) {
  //   this.appointmentValidation.getAll({ query });

  //   const supervisor = await this.doctorService.findSupervisorDoctor(
  //     user.doctor,
  //   );
  //   const subject = await this.subjectService.findOne(supervisor.subjectId);

  //   const filter = new AppointmentFilterObject().getSubjects([subject.id]);
  //   const { pagination } = paginationParser(query);

  //   const appointments = await this.appointmentService.findAllForSupervisor(
  //     filter.build(),
  //     pagination,
  //   );

  //   return {
  //     count: appointments.count,
  //     rows: appointments.rows.map((appointment) =>
  //       new GetByCriteriaAppointmentsMobileSupervisorResponse({
  //         appointment,
  //         languageKey: header.languageKey,
  //       }).toObject(),
  //     ),
  //   };
  // }
}
