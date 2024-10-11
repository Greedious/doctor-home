import { language } from 'package/utils/language/language';
import { Chair } from 'src/university/chair/data/chair.schema';

export class GetChairsDashboardResponse {
  id: number;
  name: language;
  capacity: number;
  subjects: {
    id: number;
    name: language;
  }[];

  constructor({ chair, languageKey }: { chair: Chair; languageKey: string }) {
    this.id = chair.id;
    this.name = chair.name;
    this.capacity = chair.capacity;
    this.subjects = chair.subjects.map((subject) => {
      return { id: subject.id, name: subject.name };
    });
  }

  toObject(): {
    id: number;
    name: language;
    capacity: number;
    subjects: {
      id: number;
      name: language;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      capacity: this.capacity,
      subjects: this.subjects,
    };
  }
}
