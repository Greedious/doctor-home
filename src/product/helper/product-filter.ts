import { Op, WhereOptions } from 'sequelize';
import { Product } from '../data/product.schema';

export class ProductFilterObject {
  filter: WhereOptions<Product>;

  constructor() {
    this.filter = {
      [Op.or]: [],
      [Op.and]: [],
    };
  }
  getSubcategoryId(subcategoryId: number) {
    this.filter[Op.and].push({ subcategoryId });
    return this;
  }
  getCategoryId(categoryId: number) {
    this.filter[Op.and].push({ categoryId });
    return this;
  }

  getId(id: number) {
    this.filter[Op.and].push({ id });
    return this;
  }
  getIsActive(isActive: boolean) {
    this.filter[Op.and].push({ isActive });
    return this;
  }
  getSearch(search: string) {
    this.filter[Op.and].push({
      [Op.or]: [
        {
          'name.ar': {
            [Op.iRegexp]: search,
          },
        },
        {
          'name.en': {
            [Op.iRegexp]: search,
          },
        },
      ],
    });
    // this.filter[Op.or].push({
    //   'name.en': {
    //     [Op.iRegexp]: search,
    //   },
    // });
    // this.filter[Op.or].push({
    //   'name.ar': {
    //     [Op.iRegexp]: search,
    //   },
    // });
    return this;
  }

  build() {
    const result: WhereOptions<Product> = {};
    if (this.filter[Op.and].length) result[Op.and] = this.filter[Op.and];
    if (this.filter[Op.or].length) result[Op.or] = this.filter[Op.or];
    return result;
  }
}
