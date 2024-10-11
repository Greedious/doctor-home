import { Variant, VariantType } from 'src/variant/data/variant.schema';
import { VariantResponse } from '.';

export class GetVariantEntity {
  id: number;
  key: string;
  type: VariantType;
  values: string[];

  constructor({ variant, lang }: { variant: Variant; lang: string }) {
    this.id = variant.id;
    this.key = variant.key[lang];
    this.type = variant.type;
    this.values = variant.values;
  }

  toObject(): VariantResponse {
    return {
      id: this.id,
      key: this.key,
      type: this.type,
      values: this.values,
    };
  }
}
