import { Op, WhereOptions } from 'sequelize';
import { Review } from '../data/review.schema';

export class ReviewFilterObject {
  filter: WhereOptions<Review>;

  constructor() {
    this.filter = {
      [Op.or]: [],
      [Op.and]: [],
    };
  }
  getProduct(productId: number) {
    if (!productId) return this;
    this.filter[Op.and].push({ productId });
    return this;
  }
  getComments() {
    this.filter[Op.and].push({
      comment: {
        [Op.ne]: null,
      },
    });
    return this;
  }
  getUser(userId: number) {
    if (!userId) return this;
    this.filter[Op.and].push({ userId });
    return this;
  }

  getId(id: number) {
    this.filter[Op.and].push({ id });
    return this;
  }

  getSearch(search: string) {
    this.filter[Op.or].push({
      'name.en': {
        [Op.iLike]: `%${search}%`,
      },
    });
    this.filter[Op.or].push({
      'name.ar': {
        [Op.iLike]: `%${search}%`,
      },
    });
    return this;
  }

  build() {
    const result: WhereOptions<Review> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
