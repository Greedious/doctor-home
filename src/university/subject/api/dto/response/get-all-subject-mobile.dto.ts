import { Subject } from 'src/university/subject/data/subject.schema';

export class GetByCriteriaSubjectMobileResponse {
  id: number;
  name: string;

  constructor({
    subject,
    languageKey,
  }: {
    subject: Subject;
    languageKey: string;
  }) {
    this.id = subject.id;
    this.name = subject.name[languageKey];
  }

  toObject(): {
    id: number;
    name: string;
  } {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
