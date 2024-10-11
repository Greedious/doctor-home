import { Module } from '@nestjs/common';
import { PatientDashboardService } from './service/patient-dashboard.service';
import { PatientError } from './service/patient-error.service';
import { PatientController } from './api/controller/patient-dashboard.controller';
import { PatientService } from './service/patient.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from './data/patient.schema';
import { PatientMobileService } from './service/patient-mobile.service';
import { PatientMobileController } from './api/controller/patient-mobile.controller';
import { ImageModule } from 'src/image/image.module';
import { StudentModule } from '../student/student.module';
import { PatientRepository } from './data/patient.repository';
import { PatientValidation } from './api/validation';
import { SubjectModule } from '../subject/subject.module';
import { TeacherModule } from '../teacher/teacher.module';
import { TaskModule } from '../task/task.module';
import { RequestPatientModule } from '../request-patient/request-patient.module';
import { DoctorModule } from 'src/account/doctor/doctor.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Patient]),
    ImageModule,
    StudentModule,
    SubjectModule,
    TeacherModule,
    TaskModule,
    RequestPatientModule,
    DoctorModule,
  ],
  controllers: [PatientController, PatientMobileController],
  providers: [
    PatientDashboardService,
    PatientError,
    PatientService,
    PatientMobileService,
    PatientValidation,
    PatientRepository,
  ],
  exports: [PatientService],
})
export class PatientModule {}
