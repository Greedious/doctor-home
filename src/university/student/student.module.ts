import { Module, forwardRef } from '@nestjs/common';
import { StudentMobileService } from './service/student-mobile.service';
import { StudentDashboardController } from './api/controller/student-dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './data/student.schema';
import { StudentDashboardService } from './service/student-dashboard.service';
import { StudentValidation } from './api/validation';
import { StudentRepository } from './data/student.repository';
import { StudentError } from './service/student-error.service';
import { YearModule } from '../year/year.module';
import { GroupModule } from '../group/group.module';
import { DoctorModule } from 'src/account/doctor/doctor.module';
import { StudentService } from './service/student.service';
import { StatusModule } from '../status/status.module';
import { ChairModule } from '../chair/chair.module';
import { SubjectModule } from '../subject/subject.module';
import { StudentMobileController } from './api/controller/student-mobile.controller';
import { SupervisorModule } from '../supervisor/supervisor.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Student]),
    forwardRef(() => YearModule),
    forwardRef(() => GroupModule),
    forwardRef(() => DoctorModule),
    forwardRef(() => StatusModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => SupervisorModule),
  ],
  controllers: [StudentDashboardController, StudentMobileController],
  providers: [
    StudentMobileService,
    StudentError,
    StudentDashboardService,
    StudentValidation,
    StudentRepository,
    StudentService,
    StudentMobileService,
  ],
  exports: [
    StudentDashboardService,
    StudentService,
    StudentRepository,
    StudentError,
  ],
})
export class StudentModule {}
