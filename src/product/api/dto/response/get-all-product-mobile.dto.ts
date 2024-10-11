import { constructFileUrl } from 'package/utils/methods';
import { roundToNearest } from 'package/utils/round-for-rate';
import { Favorite } from 'src/favorite/data/favorite.schema';
import { Product } from 'src/product/data/product.schema';
import { IUser } from 'src/shared/types/user';

export interface IGetByCriteriaProductMobileResponse {
  id: number;
  sku: number;
  name: string;
  image: string;
  price: number;
  rate: number;
  totalRates: number;
  reviewCount: number[];
  isFavorite: boolean;
}
export class GetByCriteriaProductMobileResponse {
  id: number;
  sku: number;
  name: string;
  image?: string;
  price?: number;
  rate: number;
  totalRates: number;
  isFavorite: boolean;
  reviewCount: number[];

  constructor({
    product,
    languageKey,
    user,
  }: {
    product: Product;
    languageKey: string;
    user: IUser;
  }) {
    this.id = product.id;
    this.sku = product.defaultSkuId;
    this.name = product.name[languageKey || 'ar'];
    this.image =
      constructFileUrl(product.defaultSku?.image.key) ||
      constructFileUrl(product.image.key);
    this.price = product.defaultSku?.price || product.mainPrice;
    this.rate = product.totalRates
      ? roundToNearest(
          Number((product.rateSum / product.totalRates).toFixed(2)),
        )
      : 0;
    this.reviewCount = product.reviewCount;
    this.totalRates = product.totalRates;
    this.isFavorite = product.favorites.some(
      (favorite: Favorite) => favorite.userId === user.id,
    );
  }

  toObject(): IGetByCriteriaProductMobileResponse {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      price: this.price,
      rate: this.rate,
      image: this.image,
      totalRates: this.totalRates,
      reviewCount: this.reviewCount,
      isFavorite: this.isFavorite,
    };
  }
}
