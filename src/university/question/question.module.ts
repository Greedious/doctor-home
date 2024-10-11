import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './data/question.schema';
import { QuestionDashboardController } from './api/controller/question-dashboard.controller';
import { QuestionMobileController } from './api/controller/question-mobile.controller';
import { QuestionRepository } from './data/question.repository';
import { QuestionDashboardService } from './service/question-dashboard.service';
import { QuestionError } from './service/question-error.service';
import { QuestionValidation } from './api/validation';
import { QuestionService } from './service/question.service';
import { QuestionMobileService } from './service/question-mobile.service';

@Module({
  imports: [SequelizeModule.forFeature([Question])],
  controllers: [QuestionDashboardController, QuestionMobileController],
  providers: [
    QuestionRepository,
    QuestionDashboardService,
    QuestionError,
    QuestionValidation,
    QuestionService,
    QuestionMobileService,
  ],
  exports: [QuestionService],
})
export class QuestionModule {}
