import { Module, forwardRef } from '@nestjs/common';
import { SupervisorMobileService } from './service/supervisor-mobile.service';
import { SupervisorDashboardController } from './api/controller/supervisor-dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Supervisor } from './data/supervisor.schema';
import { SupervisorDashboardService } from './service/supervisor-dashboard.service';
import { SupervisorValidation } from './api/validation';
import { SupervisorRepository } from './data/supervisor.repository';
import { SupervisorError } from './service/supervisor-error.service';
import { SpecialtyModule } from '../specialty/specialty.module';
import { DoctorModule } from 'src/account/doctor/doctor.module';
import { GroupModule } from '../group/group.module';
import { SubjectModule } from '../subject/subject.module';
import { StatusModule } from '../status/status.module';
import { SupervisorService } from './service/supervisor.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Supervisor]),
    SpecialtyModule,
    forwardRef(() => DoctorModule),
    GroupModule,
    forwardRef(() => SubjectModule),
    forwardRef(() => StatusModule),
  ],
  controllers: [SupervisorDashboardController],
  providers: [
    SupervisorMobileService,
    SupervisorError,
    SupervisorDashboardService,
    SupervisorValidation,
    SupervisorRepository,
    SupervisorService,
  ],
  exports: [SupervisorService, SupervisorRepository, SupervisorError],
})
export class SupervisorModule {}
