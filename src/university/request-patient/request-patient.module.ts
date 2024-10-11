import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestPatient } from './data/request-patient.schema';
import { RequestPatientMobileService } from './service/request-patient-mobile.service';
import { RequestPatientMobileController } from './api/controller/request-patient-mobile.controller';
import { ImageModule } from 'src/image/image.module';
import { StudentModule } from '../student/student.module';
import { RequestPatientValidation } from './api/validation';
import { SubjectModule } from '../subject/subject.module';
import { TeacherModule } from '../teacher/teacher.module';
import { TaskModule } from '../task/task.module';
import { PatientRepository } from '../patient/data/patient.repository';
import { RequestPatientRepository } from './data/request-patient.repository';
import { RequestPatientService } from './service/request-patient.service';

@Module({
  imports: [
    SequelizeModule.forFeature([RequestPatient]),
    ImageModule,
    StudentModule,
    SubjectModule,
    TeacherModule,
    TaskModule,
  ],
  controllers: [RequestPatientMobileController],
  providers: [
    RequestPatientValidation,
    RequestPatientMobileService,
    RequestPatientRepository,
    RequestPatientService,
  ],
  exports: [RequestPatientService],
})
export class RequestPatientModule {}
