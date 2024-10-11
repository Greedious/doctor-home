import { Module, forwardRef } from '@nestjs/common';
import { SpecialtyMobileService } from './service/specialty-mobile.service';
import { SpecialtyDashboardController } from './api/controller/specialty-dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Specialty } from './data/specialty.schema';
import { SpecialtyDashboardService } from './service/specialty-dashboard.service';
import { SpecialtyValidation } from './api/validation';
import { SpecialtyRepository } from './data/specialty.repository';
import { SpecialtyError } from './service/specialty-error.service';
import { SpecialtyService } from './service/specialty.service';
import { TeacherModule } from '../teacher/teacher.module';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Specialty]),
    forwardRef(() => TeacherModule),
    forwardRef(() => StatusModule),
  ],
  controllers: [SpecialtyDashboardController],
  providers: [
    SpecialtyMobileService,
    SpecialtyError,
    SpecialtyDashboardService,
    SpecialtyValidation,
    SpecialtyRepository,
    SpecialtyService,
  ],
  exports: [SpecialtyService],
})
export class SpecialtyModule {}
