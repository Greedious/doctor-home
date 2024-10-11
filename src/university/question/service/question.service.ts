import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../data/question.repository';
import { QuestionError } from './question-error.service';

@Injectable()
export class QuestionService {
  constructor(
    private questionRepository: QuestionRepository,
    private questionError: QuestionError,
  ) {}
}
