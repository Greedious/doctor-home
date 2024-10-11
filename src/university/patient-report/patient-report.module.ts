import { Module } from '@nestjs/common';
import { TaskModule } from '../task/task.module';
import { PatientReportDashboardController } from './api/controller/patient-report-dashboard.controller';
import { PatientReportMobileController } from './api/controller/patient-report-mobile.controller';
import { PatientReportDashboardService } from './service/patient-report-dashboard.service';
import { PatientReportMobileService } from './service/patient-report-mobile.service';
import { PatientModule } from '../patient/patient.module';
import { PatientReportRepository } from './data/patient-report.repository';
import { PatientReportError } from './service/patient-report-error.service';
import { PatientReport } from './data/patient-report.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { PatientReportValidation } from './api/validation';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    SequelizeModule.forFeature([PatientReport]),
    TaskModule,
    PatientModule,
    AppointmentModule,
  ],
  controllers: [
    PatientReportDashboardController,
    PatientReportMobileController,
  ],
  providers: [
    PatientReportDashboardService,
    PatientReportMobileService,
    PatientReportRepository,
    PatientReportError,
    PatientReportValidation,
  ],
  exports: [],
})
export class PatientReportModule {}
