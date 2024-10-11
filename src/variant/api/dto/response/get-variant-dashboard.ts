import { Variant, VariantType } from 'src/variant/data/variant.schema';
import { VariantDashboardResponse } from '.';
import { language } from 'package/utils/language/language';

export class GetVariantDashboardEntity {
  id: number;
  name: language;
  type: VariantType;
  values: string[];

  constructor({ variant }: { variant: Variant }) {
    this.id = variant.id;
    this.name = variant.name;
    this.type = variant.type;
    this.values = variant.values;
  }

  toObject(): VariantDashboardResponse {
    return {
      id: this.id,
      key: this.name,
      type: this.type,
      values: this.values,
    };
  }
}
