import { language } from 'package/utils/language/language';
import { Mark } from 'src/university/mark/data/mark.schema';

export interface IGetMarksDashboardResponse {
  id: number;
  mark: number;
  subject: { id: number; name: language };
}

export class GetMarksDashboardResponse {
  id: number;
  mark: number;
  subject: { id: number; name: language };

  constructor({ languageKey, mark }: { mark: Mark; languageKey: string }) {
    this.id = mark.id;
    this.mark = mark.mark;
    this.subject = {
      id: this.subject.id,
      name: this.subject.name,
    };
  }

  toObject(): IGetMarksDashboardResponse {
    return { id: this.id, mark: this.mark, subject: this.subject };
  }
}
