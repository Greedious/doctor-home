import { Question } from 'src/university/question/data/question.schema';

export interface IGetByIdQuestionMobileResponse {
  id: number;
  question: string;
}

export class GetByIdQuestionMobileResponse {
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

  toObject(): IGetByIdQuestionMobileResponse {
    return {
      id: this.id,
      question: this.question,
    };
  }
}
