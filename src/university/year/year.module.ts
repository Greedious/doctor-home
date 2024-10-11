import { Module, forwardRef } from '@nestjs/common';
import { YearMobileService } from './service/year-mobile.service';
import { YearDashboardController } from './api/controller/year-dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Year } from './data/year.schema';
import { YearDashboardService } from './service/year-dashboard.service';
import { YearValidation } from './api/validation';
import { YearRepository } from './data/year.repository';
import { YearError } from './service/year-error.service';
import { GroupModule } from '../group/group.module';
import { YearService } from './service/year.service';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Year]),
    forwardRef(() => GroupModule),
    forwardRef(() => StatusModule),
  ],
  controllers: [YearDashboardController],
  providers: [
    YearMobileService,
    YearError,
    YearDashboardService,
    YearValidation,
    YearRepository,
    YearService,
  ],
  exports: [YearDashboardService, YearService],
})
export class YearModule {}
