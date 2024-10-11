import { language } from 'package/utils/language/language';
import { constructFileUrl } from 'package/utils/methods';
import { Product } from 'src/product/data/product.schema';

export interface IProductSkuDashboardResponse {
  id: number;
  price: number;
  quantity: number;
  image?: string;
  specifications: { name: string; value: string }[];
}
export interface IProductVariantDashboardResponse {
  id: number;
  name: language;
  values: string[];
  type: string;
}

export interface IProductCategoryDashboardResponse {
  id: number;
  name: string;
  image?: string;
}

export interface IGetByIdProductDashboardResponse {
  id: number;
  name: language;
  mainPrice: number;
  description: language;
  quantity: number;
  reviewCount: number[];
  rateSum: number;
  totalRates: number;
  isActive: boolean;
  image?: string;
  category?: IProductCategoryDashboardResponse;
  subcategory?: IProductCategoryDashboardResponse;
  variants: IProductVariantDashboardResponse[];
  stockKeepingUnits: IProductSkuDashboardResponse[];
}

export class GetByIdProductDashboardResponse {
  id: number;
  name: language;
  mainPrice: number;
  description: language;
  quantity: number;
  reviewCount: number[];
  rateSum: number;
  totalRates: number;
  isActive: boolean;
  image?: string;
  category?: IProductCategoryDashboardResponse;
  subcategory?: IProductCategoryDashboardResponse;
  variants: IProductVariantDashboardResponse[];
  stockKeepingUnits: IProductSkuDashboardResponse[];

  constructor({
    product,
    languageKey,
  }: {
    product: Product;
    languageKey: string;
  }) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.mainPrice = product.mainPrice;
    this.reviewCount = product.reviewCount;
    this.rateSum = product.rateSum;
    this.totalRates = product.totalRates;
    this.isActive = product.isActive;
    this.image = constructFileUrl(product?.image.key);
    this.category = product.category
      ? {
          id: product.categoryId,
          image: constructFileUrl(product.category.image?.key),
          name: product.category.name[languageKey],
        }
      : undefined;

    this.variants = product.variants.map((variant) => {
      return {
        id: variant.id,
        name: variant.name[languageKey],
        type: variant.type,
        values: variant.values,
      };
    });

    this.stockKeepingUnits = product.skus.map((sku) => {
      return {
        id: sku.id,
        price: sku.price,
        quantity: sku.quantity,
        image: constructFileUrl(sku.image?.key),
        specifications: sku.skusProduct.map((skuProduct) => {
          return { name: skuProduct.key, value: skuProduct.value };
        }),
      };
    });
  }

  toObject(): IGetByIdProductDashboardResponse {
    const response = {
      id: this.id,
      name: this.name,
      description: this.description,
      mainPrice: this.mainPrice,
      quantity: this.quantity,
      reviewCount: this.reviewCount,
      rateSum: this.rateSum,
      totalRates: this.totalRates,
      isActive: this.isActive,
      image: this.image,
      category: this.category,
      subcategory: this.subcategory,
      variants: this.variants,
      stockKeepingUnits: this.stockKeepingUnits,
    };
    return response;
  }
}
