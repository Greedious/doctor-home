import { Module, forwardRef } from '@nestjs/common';
import { StatusDashboardController } from './api/controller/status-dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Status } from './data/status.schema';
import { StatusDashboardService } from './service/status-dashboard.service';
import { StatusValidation } from './api/validation';
import { StatusRepository } from './data/status.repository';
import { StatusError } from './service/status-error.service';
import { StatusService } from './service/status.service';
import { SubjectModule } from '../subject/subject.module';
import { TeacherModule } from '../teacher/teacher.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Status]),
    SubjectModule,
    forwardRef(() => TeacherModule),
    forwardRef(() => StudentModule),
  ],
  controllers: [StatusDashboardController],
  providers: [
    StatusError,
    StatusDashboardService,
    StatusValidation,
    StatusRepository,
    StatusService,
  ],
  exports: [StatusDashboardService, StatusService, StatusRepository],
})
export class StatusModule {}
