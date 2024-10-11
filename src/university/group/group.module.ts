import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group, GroupSchedule } from './data/group.schema';
import { GroupDashboardService } from './service/group-dashboard.service';
import {
  GroupRepository,
  GroupScheduleRepository,
} from './data/group.repository';
import { GroupError } from './service/group-error.service';
import { GroupValidation } from './api/validation';
import { GroupService } from './service/group.service';
import { GroupDashboardController } from './api/controller/group-dashboard.controller';
import { YearModule } from '../year/year.module';
import { GroupScheduleDashboardController } from './api/controller/group-schedule-dashboard.controller';
import { SubjectModule } from '../subject/subject.module';
import { StudentModule } from '../student/student.module';
import { GroupScheduleMobileController } from './api/controller/group-schedule-mobile-controller';
import { GroupMobileService } from './service/group-mobile.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Group, GroupSchedule]),
    forwardRef(() => YearModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => StudentModule),
  ],
  controllers: [
    GroupDashboardController,
    GroupScheduleDashboardController,
    GroupScheduleMobileController,
  ],
  providers: [
    GroupDashboardService,
    GroupRepository,
    GroupScheduleRepository,
    GroupError,
    GroupValidation,
    GroupService,
    GroupMobileService,
  ],
  exports: [
    GroupDashboardService,
    GroupService,
    GroupScheduleRepository,
    GroupError,
  ],
})
export class GroupModule {}
