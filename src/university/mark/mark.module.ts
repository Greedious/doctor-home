import { Module } from '@nestjs/common';
import { StudentModule } from '../student/student.module';
import { SubjectModule } from '../subject/subject.module';
import { MarkMobileController } from './api/controller/mark-mobile.controller';
import { MarkValidation } from './api/validation';
import { MarkMobileService } from './service/mark-mobile.service';
import { MarkRepository } from './data/mark.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { MarkError } from './service/mark-error.service';
import { Mark } from './data/mark.schema';
import { SupervisorModule } from '../supervisor/supervisor.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Mark]),
    StudentModule,
    SubjectModule,
    StudentModule,
    SupervisorModule,
  ],
  controllers: [MarkMobileController],
  providers: [MarkValidation, MarkMobileService, MarkRepository, MarkError],
  exports: [],
})
export class MarkModule {}
