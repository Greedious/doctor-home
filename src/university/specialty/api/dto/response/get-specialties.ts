import { language } from 'package/utils/language/language';
import { Specialty } from 'src/university/specialty/data/specialty.schema';

export class GetSpecialtiesResponse {
  id: number;
  name: language;

  constructor({
    specialty,
    languageKey,
  }: {
    specialty: Specialty;
    languageKey: string;
  }) {
    this.id = specialty.id;
    this.name = specialty.name;
  }

  toObject() {
    const response = {
      id: this.id,
      name: this.name,
    };
    return response;
  }
}
