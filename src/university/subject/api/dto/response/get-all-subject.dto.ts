import { language } from 'package/utils/language/language';
import { Subject } from 'src/university/subject/data/subject.schema';

export class GetByCriteriaSubjectResponse {
  id: number;
  name: language;
  season: number;
  year: {
    id: number;
    name: language;
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
      name: subject.year.name,
    };
    this.season = subject.season;
    this.name = subject.name;
  }

  toObject(): {
    id: number;
    name: language;
    season: number;
    year: {
      id: number;
      name: language;
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
