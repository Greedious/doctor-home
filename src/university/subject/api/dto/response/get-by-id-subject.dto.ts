import { language } from 'package/utils/language/language';
import { Subject } from 'src/university/subject/data/subject.schema';

export interface IGetByIdSubjectResponse {
  id: number;
  name: language;
  season: number;
  year: {
    id: number;
    name: string;
  };
}
export class GetByIdSubjectResponse {
  id: number;
  name: language;
  season: number;
  year: {
    id: number;
    name: string;
  };

  constructor({
    subject,
    languageKey,
  }: {
    subject: Subject;
    languageKey: string;
  }) {
    this.id = subject.id;
    this.year = {
      id: this.year.id,
      name: this.year.name[languageKey || 'ar'],
    };
    this.season = subject.season;
    this.name = subject.name;
  }

  toObject(): IGetByIdSubjectResponse {
    return {
      id: this.id,
      name: this.name,
      season: this.season,
      year: this.year,
    };
  }
}
