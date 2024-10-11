import { constructFileUrl } from 'package/utils/methods';
import { roundToNearest } from 'package/utils/round-for-rate';
import { Favorite } from 'src/favorite/data/favorite.schema';
import { Product } from 'src/product/data/product.schema';
import { IUser } from 'src/shared/types/user';

export class GetByIdProductMobileResponse {
  id: number;
  skuId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  totalRates: number;
  rate: number;
  isFavorite: boolean;
  category: {
    id: number;
    name: string;
  };
  variant: {
    id: number;
    key: string;
    name: string;
    type: string;
    values: string[];
  }[];
  reviews: {
    id: number;
    comment: string;
    date: Date;
    user: {
      id: number;
      name: string;
    };
    rate: number;
  }[];

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
    this.skuId = product.defaultSkuId;
    this.name = product.name[languageKey || 'ar'];
    this.description = product.description[languageKey || 'ar'];
    this.price = product.defaultSku?.price || product.mainPrice;
    this.category = {
      id: product.category.id,
      name: product.category.name[languageKey || 'ar'],
    };
    this.quantity = product.defaultSku?.quantity || product.quantity;
    this.image =
      constructFileUrl(product.defaultSku?.image.key) ||
      constructFileUrl(product.image.key);
    this.rate = roundToNearest(Number((5 * Math.random()).toFixed(2)));
    this.totalRates = Math.round(Math.random() * 1000);
    this.isFavorite = product.favorites.some(
      (favorite: Favorite) => favorite.userId === user.id,
    );
    this.variant = product.variants.map((variant) => {
      return {
        id: variant.id,
        key: variant.key,
        type: variant.type,
        name: variant.name[languageKey || 'ar'],
        values: variant.values,
      };
    });
    this.reviews = product.reviews.map((review) => {
      return {
        id: review.id,
        comment: review.comment,
        rate: review.rate,
        date: review.createdAt,
        user: {
          id: review.user.id,
          name:
            review.user.doctor.firstName + ' ' + review.user.doctor.lastName,
        },
      };
    });
  }

  toObject(): {
    id: number;
    skuId: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    totalRates: number;
    rate: number;
    isFavorite: boolean;
    category: {
      id: number;
      name: string;
    };
    variant: {
      id: number;
      key: string;
      name: string;
      values: string[];
    }[];
    reviews: {
      id: number;
      comment: string;
      date: Date;
      user: {
        id: number;
        name: string;
      };
      rate: number;
    }[];
  } {
    return {
      id: this.id,
      skuId: this.skuId,
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image,
      quantity: this.quantity,
      totalRates: this.totalRates,
      category: this.category,
      rate: this.rate,
      isFavorite: this.isFavorite,
      variant: this.variant,
      reviews: this.reviews,
    };
  }
}
