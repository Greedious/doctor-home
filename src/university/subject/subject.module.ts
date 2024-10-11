import { Module, forwardRef } from '@nestjs/common';
import { SubjectDashboardService } from './service/subject-dashboard.service';
import { SubjectError } from './service/subject-error.service';
import { SubjectValidation } from './api/validation';
import { SubjectRepository } from './data/subject.repository';
import { SubjectController } from './api/controller/subject-dashboard.controller';
import { SubjectService } from './service/subject.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subject } from './data/subject.schema';
import { SubjectMobileService } from './service/subject-mobile.service';
import { SubjectMobileController } from './api/controller/subject-mobile.controller';
import { YearModule } from '../year/year.module';
import { TeacherSubject } from '../teacher/data/teacher.schema';
import { StatusModule } from '../status/status.module';
import { TaskModule } from '../task/task.module';
import { StudentModule } from '../student/student.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Subject, TeacherSubject]),
    forwardRef(() => YearModule),
    forwardRef(() => StatusModule),
    TaskModule,
    StudentModule,
    forwardRef(() => GroupModule),
  ],
  controllers: [SubjectController, SubjectMobileController],
  providers: [
    SubjectRepository,
    SubjectDashboardService,
    SubjectError,
    SubjectValidation,
    SubjectService,
    SubjectMobileService,
  ],
  exports: [SubjectService, SubjectRepository, SubjectError],
})
export class SubjectModule {}
