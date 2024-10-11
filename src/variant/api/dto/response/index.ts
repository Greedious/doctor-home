import { language } from 'package/utils/language/language';
import { VariantType } from 'src/variant/data/variant.schema';

export class VariantResponse {
  id: number;
  key: string;
  type: VariantType;
  values: string[];
}

export class VariantDashboardResponse {
  id: number;
  key: language;
  type: VariantType;
  values: string[];
}
