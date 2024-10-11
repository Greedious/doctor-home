import { Op, WhereOptions } from 'sequelize';
import { Favorite } from '../data/favorite.schema';

export class FavoriteFilterObject {
  filter: WhereOptions<Favorite>;

  constructor() {
    this.filter = {
      [Op.or]: [],
      [Op.and]: [],
    };
  }
  getUserId(userId: number) {
    if (!userId) return this;
    this.filter[Op.and].push({ userId });
    return this;
  }
  getProductId(productId: number) {
    if (!productId) return this;
    this.filter[Op.and].push({ productId });
    return this;
  }

  build() {
    const result: WhereOptions<Favorite> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
