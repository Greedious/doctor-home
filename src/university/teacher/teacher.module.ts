import { Module, forwardRef } from '@nestjs/common';
import { TeacherMobileService } from './service/teacher-mobile.service';
import { TeacherDashboardController } from './api/controller/teacher-dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  SupervisedGroup,
  Teacher,
  TeacherSubject,
} from './data/teacher.schema';
import { TeacherDashboardService } from './service/teacher-dashboard.service';
import { TeacherValidation } from './api/validation';
import {
  SupervisedGroupRepository,
  TeacherRepository,
  TeacherSubjectRepository,
} from './data/teacher.repository';
import { TeacherError } from './service/teacher-error.service';
import { SpecialtyModule } from '../specialty/specialty.module';
import { DoctorModule } from 'src/account/doctor/doctor.module';
import { GroupModule } from '../group/group.module';
import { SubjectModule } from '../subject/subject.module';
import { TeacherSubjectController } from './api/controller/teacher-subject.controller';
import { StatusModule } from '../status/status.module';
import { TeacherService } from './service/teacher.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Teacher, TeacherSubject, SupervisedGroup]),
    forwardRef(() => SpecialtyModule),
    forwardRef(() => DoctorModule),
    GroupModule,
    forwardRef(() => SubjectModule),
    forwardRef(() => StatusModule),
  ],
  controllers: [TeacherDashboardController, TeacherSubjectController],
  providers: [
    TeacherSubjectRepository,
    TeacherMobileService,
    TeacherError,
    TeacherDashboardService,
    TeacherValidation,
    TeacherRepository,
    SupervisedGroupRepository,
    TeacherService,
  ],
  exports: [TeacherService, TeacherRepository, TeacherError],
})
export class TeacherModule {}
