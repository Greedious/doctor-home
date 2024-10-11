import { language } from 'package/utils/language/language';
import { constructFileUrl } from 'package/utils/methods';
import { roundToNearest } from 'package/utils/round-for-rate';
import { Product } from 'src/product/data/product.schema';

export interface IGetByCriteriaProductResponse {
  id: number;
  sku: number;
  name: language;
  image: string;
  price: number;
  rate: number;
  totalRates: number;
}

export class GetByCriteriaProductResponse {
  id: number;
  sku: number;
  name: language;
  image?: string;
  price?: number;
  rate: number;
  totalRates: number;

  constructor({
    product,
    languageKey,
  }: {
    product: Product;
    languageKey: string;
  }) {
    this.id = product.id;
    this.sku = product.defaultSkuId;
    this.name = product.name;
    this.image =
      constructFileUrl(product.defaultSku?.image.key) ||
      constructFileUrl(product.image.key);
    this.price = product.defaultSku?.price || product.mainPrice;
    this.rate = product.totalRates
      ? roundToNearest(
          Number((product.rateSum / product.totalRates).toFixed(2)),
        )
      : 0;
    this.totalRates = Math.round(Math.random() * 1000);
  }

  toObject(): IGetByCriteriaProductResponse {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      price: this.price,
      rate: this.rate,
      image: this.image,
      totalRates: this.totalRates,
    };
  }
}
