import { Module } from '@nestjs/common';
import { UniversityStatisticsController } from './api/controller/university-statistics.controller';
import { UniversityStatisticsService } from './service/statistics.service';
import { StudentModule } from '../student/student.module';
import { PatientModule } from '../patient/patient.module';
import { TeacherModule } from '../teacher/teacher.module';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [StudentModule, PatientModule, TeacherModule, AppointmentModule],
  controllers: [UniversityStatisticsController],
  providers: [UniversityStatisticsService],
})
export class UniversityStatisticsModule {}
