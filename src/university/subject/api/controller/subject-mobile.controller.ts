import { Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { SubjectMobileService } from 'src/university/subject/service/subject-mobile.service';
import { SubjectValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByIdSubjectMobileResponse } from '../dto/response/get-by-id-mobile-subject.dto';
import { SubjectFilterObject } from 'src/university/subject/helper/subject-filter';
import { GetByCriteriaSubjectMobileResponse } from '../dto/response/get-all-subject-mobile.dto';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import {
  CreateNote,
  GetAllSubjectMobileQuery,
  GetCard,
  UpdateFields,
} from '../dto/request';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { User } from 'package/decorator/param/user.decorator';
import { IUser } from 'src/shared/types/user';
import { TaskService } from 'src/university/task/service/task.service';
import { StudentService } from 'src/university/student/service/student.service';
import { GetSubjectCard } from '../dto/response/get-subject-card-mobile.dto';
import { GetNotes } from '../dto/response/get-note.dto';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';

@AuthenticatedController({ controller: '/university/mobile/subjects' })
export class SubjectMobileController {
  constructor(
    private readonly subjectService: SubjectMobileService,
    private readonly taskService: TaskService,
    private readonly studentService: StudentService,
    private readonly subjectValidation: SubjectValidation,
  ) {}

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/card/:id',
    role: [Types.TEACHER, Types.STUDENT],
  })
  @UseInterceptors(TransactionInterceptor)
  async updateCard(
    @Param() params: Params,
    @Query() query: GetCard,
    @Body() body: UpdateFields,
    @User() user: IUser,
    @TransactionParam() transaction: Transaction,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.subjectValidation.updateFields({ params, user, query, body });
    await this.subjectService.findOne(params);
    await this.studentService.findOne(user.student || query.studentId);
    await this.studentService.checkSubjectInStudentYear(
      user.student || query.studentId,
      +params.id,
    );
    await this.taskService.updateFields(
      user,
      +params.id,
      user.student || query.studentId,
      body,
      transaction,
    );

    return;
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/card/:id',
    role: [Types.TEACHER, Types.STUDENT],
  })
  async findCard(
    @Param() params: Params,
    @Query() query: GetCard,
    @User() user: IUser,
    @Headers() { languageKey }: IHeaders,
  ) {
    this.subjectValidation.getCard({ params, user, query });
    await this.subjectService.findOne(params);
    await this.studentService.findOne(user.student || query.studentId);
    const card = await this.taskService.findOrCreate(
      +params.id,
      user.student || query.studentId,
    );

    const notes = await this.taskService.findNotes(
      +params.id,
      user.student || query.studentId,
    );

    return {
      clinicalTasks: card.clinicalCard.map((task) => {
        return new GetSubjectCard({ task, languageKey }).toObject();
      }),
      laboratoryTasks: card.laboratoryCard.map((task) => {
        return new GetSubjectCard({ task, languageKey });
      }),
      notes: new GetNotes({ notes }).toObject(),
    };
  }

  @AuthorizedApi({
    api: Api.POST,
    url: '/:id/add-note',
    role: [Types.TEACHER, Types.SUPERVISOR],
  })
  async createNote(
    @Body() body: CreateNote,
    @Param() params: Params,
    @User() user: IUser,
    @Query() query: GetCard,
  ) {
    this.subjectValidation.createNote({ body, params, user, query });
    const note = await this.taskService.createNote(
      user,
      params,
      body,
      user.student || query.studentId,
    );
    return {
      id: note._id,
    };
  }
  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    role: [Types.DOCTOR],
  })
  async findOne(@Param() params: Params, @Headers() { languageKey }: IHeaders) {
    this.subjectValidation.paramsId({ params });
    const subject = await this.subjectService.findOne(params);
    return {
      row: new GetByIdSubjectMobileResponse({
        subject,
        languageKey,
      }).toObject(),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.TEACHER, Types.STUDENT],
  })
  async findAll(
    @Query() query: GetAllSubjectMobileQuery,
    @User() user: IUser,
    @Headers() { languageKey }: IHeaders,
  ) {
    const filter = new SubjectFilterObject();
    if (user.student) {
      const student = await this.studentService.findOne(user.student);
      filter.getYear(student.yearId);
    }
    const subject = await this.subjectService.findAll(filter.build(), user);
    return {
      rows: subject.map((subject) =>
        new GetByCriteriaSubjectMobileResponse({
          subject,
          languageKey,
        }).toObject(),
      ),
    };
  }
}
