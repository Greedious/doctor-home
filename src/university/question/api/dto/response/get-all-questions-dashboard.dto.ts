import { language } from 'package/utils/language/language';
import { Question } from 'src/university/question/data/question.schema';

export interface IGetByCriteriaQuestionsDashboardResponse {
  id: number;
  question: language;
}

export class GetByCriteriaQuestionsDashboardResponse {
  id: number;
  question: language;

  constructor({
    question,
    languageKey,
  }: {
    question: Question;
    languageKey: string;
  }) {
    this.id = question.id;
    this.question = question.question;
  }

  toObject(): IGetByCriteriaQuestionsDashboardResponse {
    return {
      id: this.id,
      question: this.question,
    };
  }
}
