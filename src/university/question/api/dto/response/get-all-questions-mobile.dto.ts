import { Question } from 'src/university/question/data/question.schema';

export interface IGetByCriteriaQuestionsMobileResponse {
  id: number;
  question: string;
}

export class GetByCriteriaQuestionsMobileResponse {
  id: number;
  question: string;

  constructor({
    question,
    languageKey,
  }: {
    question: Question;
    languageKey: string;
  }) {
    this.id = question.id;
    this.question = question.question[languageKey || 'ar'];
  }

  toObject(): IGetByCriteriaQuestionsMobileResponse {
    return {
      id: this.id,
      question: this.question,
    };
  }
}
