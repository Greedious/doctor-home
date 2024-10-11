import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from './data/appointment.schema';
import { AppointmentDashboardController } from './api/controller/appointment-dashboard.controller';
import { AppointmentMobileController } from './api/controller/appointment-mobile.controller';
import { AppointmentRepository } from './data/appointment.repository';
import { AppointmentDashboardService } from './service/appointment-dashboard.service';
import { AppointmentError } from './service/appointment-error.service';
import { AppointmentValidation } from './api/validation';
import { AppointmentService } from './service/appointment.service';
import { AppointmentMobileService } from './service/appointment-mobile.service';
import { StudentModule } from '../student/student.module';
import { TeacherModule } from '../teacher/teacher.module';
import { GroupModule } from '../group/group.module';
import { ChairModule } from '../chair/chair.module';
import { SubjectModule } from '../subject/subject.module';
import { PatientModule } from '../patient/patient.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Appointment]),
    StudentModule,
    TeacherModule,
    GroupModule,
    PatientModule,
    ChairModule,
    SubjectModule,
  ],
  controllers: [AppointmentDashboardController, AppointmentMobileController],
  providers: [
    AppointmentRepository,
    AppointmentDashboardService,
    AppointmentError,
    AppointmentValidation,
    AppointmentService,
    AppointmentMobileService,
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
