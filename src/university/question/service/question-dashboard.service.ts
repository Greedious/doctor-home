import { Injectable } from '@nestjs/common';
import { CreateQuestionRequest, UpdateQuestion } from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { QuestionError } from './question-error.service';
import { QuestionRepository } from '../data/question.repository';

@Injectable()
export class QuestionDashboardService {
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

  async findOne({ id }: Params) {
    const question = await this.findOneById(id);
    return question;
  }

  async findAll() {
    const questions = await this.questionRepository.findAll({});
    return questions;
  }

  async delete(id: number) {
    await this.questionRepository.delete({
      where: { id },
    });
    return;
  }

  async create(body: CreateQuestionRequest) {
    const question = await this.questionRepository.create({
      doc: body,
    });

    return {
      id: question.id,
    };
  }

  async update(body: UpdateQuestion, id: number) {
    await this.questionRepository.update({
      where: { id },
      update: body,
    });
  }
}
