import { Injectable } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { QuestionRepository } from '../data/question.repository';
import { QuestionError } from './question-error.service';

@Injectable()
export class QuestionMobileService {
  constructor(
    private questionRepository: QuestionRepository,
    private questionError: QuestionError,
  ) {}

  async findOneById(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      error: this.questionError.notFound(),
    });
    return question;
  }

  async findOne(id: number) {
    const question = await this.findOneById(id);
    return question;
  }

  async findAll() {
    const questions = await this.questionRepository.findAll({});
    return questions;
  }
}
