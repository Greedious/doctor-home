import { language } from 'package/utils/language/language';
import { Group } from 'src/university/group/data/group.schema';

export interface IGroupDashboardResponse {
  id: number;
  name: language;
  year: {
    id: number;
    name: language;
    rank: number;
  };
}

export class GetGroupDashboardResponse {
  id: number;
  name: language;
  year: {
    id: number;
    name: language;
    rank: number;
  };

  constructor({ group, languageKey }: { group: Group; languageKey: string }) {
    this.id = group.id;
    this.name = group.name;
    this.year = {
      id: group.year.id,
      name: group.year.name,
      rank: group.year.rank,
    };
  }

  toObject() {
    const response: IGroupDashboardResponse = {
      id: this.id,
      name: this.name,
      year: this.year,
    };
    return response;
  }
}
