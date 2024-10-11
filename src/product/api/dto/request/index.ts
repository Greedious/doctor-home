import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';
import { Category } from 'src/category/data/category.schema';
import { VariantType } from 'src/variant/data/variant.schema';
export enum productStatus {
  available = 'available',
  outOfStock = 'outOfStock',
  changedPrice = 'changedPrice',
  notEnoughQuantity = 'notEnoughQuantity',
}
export class CreateProductRequest {
  name: language;
  description: language;
  price: number;
  image: number;
  subcategory: number;
  variants: ProductVariant[];
  stockKeepUnits: ProductSku[];
}

export class UpdateProductRequest {
  name?: language;
  description?: language;
  price?: number;
  image: number;
  subcategory: number;
  variants: ProductVariant[];
  stockKeepUnits: ProductSku[];
}

export class ProductSku {
  variants: { name: string; value: string }[]; // the name is the variant name in english (key)
  image: number;
  price: number;
  quantity: number;
}
export class ProductVariant {
  name: language;
  values: string[];
  type: VariantType;
}

export class CreateProduct {
  name: language;
  description: language;
  price: number;
  image: number;
  subcategory: Category;
}

export class UpdateProduct {
  name?: language;
  description?: language;
  mainPrice?: number;
  imageId?: number;
  subcategoryId?: number;
  categoryId?: number;
}

export class GetAllProductQuery extends GetByCriteria {}

export class GetAllProductMobileQuery extends GetByCriteria {
  search?: string;
  categoryId?: number;
  subcategoryId?: number;
  isFavorite?: string;
}

export class GetByIdProductQuery {
  isFavorite?: boolean;
}

export class UpdateFavoriteProduct {
  favorite: boolean;
}

export class CheckProducts {
  products: {
    id: number;
    quantity: number;
    price: number;
    name?: language;
    image?: string;
    status: productStatus;
  }[];
}
export class ProductDto {
  id: number;
  quantity: number;
  name?: language;
  image?: string;
  price: number;
  subcategory?: number;
  operator?: number;
  status?: productStatus;
}
