import { Module, forwardRef } from '@nestjs/common';
import { SupervisorLogMobileService } from './service/supervisor-logs-mobile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupervisorLog } from './data/supervisor-logs.schema';
import { SupervisorLogValidation } from './api/validation';
import { SupervisorLogRepository } from './data/supervisor-logs.repository';
import { SupervisorLogError } from './service/supervisor-logs-error.service';
import { SupervisorLogService } from './service/supervisor-logs.service';
import { TeacherModule } from '../teacher/teacher.module';
import { StatusModule } from '../status/status.module';
import { SubjectModule } from '../subject/subject.module';
import { StudentModule } from '../student/student.module';
import { SupervisorLogMobileController } from './api/controller/supervisor-logs-mobile.controller';
import { SupervisorModule } from '../supervisor/supervisor.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SupervisorLog]),
    forwardRef(() => SubjectModule),
    forwardRef(() => StudentModule),
    forwardRef(() => SupervisorModule),
  ],
  controllers: [SupervisorLogMobileController],
  providers: [
    SupervisorLogMobileService,
    SupervisorLogError,
    SupervisorLogValidation,
    SupervisorLogRepository,
    SupervisorLogService,
  ],
  exports: [SupervisorLogService, SupervisorLogRepository],
})
export class SupervisorLogModule {}
