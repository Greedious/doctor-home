import { language } from 'package/utils/language/language';
import { Year } from 'src/university/year/data/year.schema';

export class GetYearsDashboardResponse {
  id: number;
  name: language;
  rank: number;
  groups?: {
    id: number;
    name: language;
  }[];

  constructor({ year, languageKey }: { year: Year; languageKey: string }) {
    this.id = year.id;
    this.name = year.name;
    this.rank = year.rank;
    this.groups = year.groups.map((group) => {
      return {
        id: group.id,
        name: group.name,
      };
    });
  }

  toObject(): {
    id: number;
    name: language;
    rank: number;
    groups?: {
      id: number;
      name: language;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      rank: this.rank,
      groups: this.groups,
    };
  }
}
