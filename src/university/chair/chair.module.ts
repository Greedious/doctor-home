import { Module, forwardRef } from '@nestjs/common';
import { ChairMobileService } from './service/chair-mobile.service';
import { ChairDashboardController } from './api/controller/chair-dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chair, ChairStudent, ChairSubject } from './data/chair.schema';
import { ChairDashboardService } from './service/chair-dashboard.service';
import { ChairValidation } from './api/validation';
import {
  ChairRepository,
  ChairStudentRepository,
} from './data/chair.repository';
import { ChairError } from './service/chair-error.service';
import { ChairService } from './service/chair.service';
import { SubjectModule } from '../subject/subject.module';
import { StudentModule } from '../student/student.module';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Chair, ChairStudent, ChairSubject]),
    SubjectModule,
    StudentModule,
    StatusModule,
  ],
  controllers: [ChairDashboardController],
  providers: [
    ChairMobileService,
    ChairError,
    ChairDashboardService,
    ChairValidation,
    ChairRepository,
    ChairService,
    ChairStudentRepository,
  ],
  exports: [ChairDashboardService, ChairService],
})
export class ChairModule {}
