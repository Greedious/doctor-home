import { language } from 'package/utils/language/language';
import { Category } from 'src/category/data/category.schema';

export class SkuParam {
  productId: number;
}
export class GetAllSku {
  [key: string]: string;
}
export class CreateSkuRequest {
  price: number;
  quantity: number;
  image: number;
  product: number;
  skusProduct: { key: string; productVariantId: number; value: string }[];
}

export class CreateSku {
  name: language;
  description: language;
  price: number;
  image: number;
  subcategory: Category;
}

export class UpdateSkuRequest {
  name?: language;
  description?: language;
  price?: number;
  image?: number;
  subcategory?: number;
  category?: number;
}

export class UpdateSku {
  name?: language;
  description?: language;
  mainPrice?: number;
  imageId?: number;
  subcategoryId?: number;
  categoryId?: number;
}

export class GetAllSkuMobile {
  isFeatured: boolean;
}
