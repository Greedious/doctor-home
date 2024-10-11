import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';
import { VariantType } from 'src/variant/data/variant.schema';

export class CreateVariant {
  name: language;
  values: string[];
  type: VariantType;
  productId: number;
}
export class UpdateVariant extends CreateVariant {
  id: number;
}

export class GetVariantsQuery {
  productId?: number;
}
