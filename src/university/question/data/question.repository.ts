import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Question } from './question.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class QuestionRepository extends SequelizeRepository<Question> {
  constructor(
    @InjectModel(Question)
    questionRepository: typeof Question,
  ) {
    super(questionRepository);
  }
}
