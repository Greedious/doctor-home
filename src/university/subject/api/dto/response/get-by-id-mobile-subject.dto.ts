import { Subject } from 'src/university/subject/data/subject.schema';

export class GetByIdSubjectMobileResponse {
  id: number;
  name: string;
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
      id: subject.year.id,
      name: subject.year.name[languageKey || 'ar'],
    };
    this.season = subject.season;
    this.name = subject.name[languageKey || 'ar'];
  }

  toObject(): {
    id: number;
    name: string;
    season: number;
    year: {
      id: number;
      name: string;
    };
  } {
    return {
      id: this.id,
      name: this.name,
      season: this.season,
      year: this.year,
    };
  }
}
