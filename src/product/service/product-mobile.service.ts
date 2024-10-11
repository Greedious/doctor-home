import { Injectable } from '@nestjs/common';

import { ProductError } from './product-error.service';
import { Product } from 'src/product/data/product.schema';
import { ProductRepository } from '../data/product.repository';
import { Includeable, WhereOptions } from 'sequelize';
import { Params } from 'package/component/params/params';
import { GetByCriteria } from 'package/pagination/dto';
import { Image } from 'src/image/data/image.schema';
import { Variant } from 'src/variant/data/variant.schema';
import {
  CheckProducts,
  GetAllProductMobileQuery,
  GetByIdProductQuery,
  productStatus,
} from '../api/dto/request';
import { SkuService } from 'src/sku/service/sku.service';
import { Favorite } from 'src/favorite/data/favorite.schema';
import { IUser } from 'src/shared/types/user';
import { Category } from 'src/category/data/category.schema';
import { Review } from 'src/review/data/review.schema';
import { User } from 'src/account/user/data/user.schema';
import { Doctor } from 'src/account/doctor/data/doctor.schema';
import { Op } from 'sequelize';
import { Sku } from 'src/sku/data/sku.schema';

@Injectable()
export class ProductMobileService {
  constructor(
    private productRepository: ProductRepository,
    private skuService: SkuService,
    private productError: ProductError,
  ) {}

  private helperMethods = {};

  async findOneById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      error: this.productError.notFound(),
    });
    return product;
  }

  async findOne({ id }: Params, query: GetByIdProductQuery, user: IUser) {
    const { isFavorite } = query;
    const include: Includeable | Includeable[] = [
      { association: 'defaultSku', include: [{ association: 'image' }] },
      Variant,
      {
        model: Favorite,
        where: { userId: user.id },
        required: isFavorite ? true : false,
      },
      {
        model: Category,
        as: 'category',
      },
      {
        model: Review,
        where: { comment: { [Op.ne]: null } },
        include: [
          {
            model: User,
            include: [Doctor],
          },
        ],
        limit: 5,
      },
    ];
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      error: this.productError.notFound(),
      include,
    });

    return product;
  }

  async findAll(
    query: GetAllProductMobileQuery,
    filter: WhereOptions<Product>,
    { limit, skip }: { limit: number; skip: number },
    user: IUser,
    favoriteFilter: WhereOptions<Favorite>,
  ) {
    //? add categories filter
    const include: Includeable | Includeable[] = [
      Image,
      {
        association: 'defaultSku',
        include: [{ association: 'image' }],
      },
      {
        model: Favorite,
        where: favoriteFilter,
        required: query.isFavorite === 'true',
      },
    ];

    const products = await this.productRepository.findAndCount({
      where: filter,
      options: { limit, offset: skip, distinct: true },
      include,
    });
    return products;
  }

  async checkProduct(body: CheckProducts) {
    let totalPrice = 0;
    const products = [];
    for (const product of body.products) {
      const sku = await this.skuService.findOneById(product.id);

      let modifiedProduct: { id: number; quantity: number; price: number };
      if (!sku) {
        modifiedProduct = { id: product.id, price: product.price, quantity: 0 };
        products.push({ ...modifiedProduct, status: productStatus.outOfStock });
      } else if (sku.price !== product.price) {
        modifiedProduct = {
          id: sku.id,
          price: sku.price,
          quantity: Math.min(product.quantity, sku.quantity),
        };
        products.push({
          ...modifiedProduct,
          status: productStatus.changedPrice,
        });
      } else if (sku.quantity < product.quantity) {
        modifiedProduct = {
          id: product.id,
          price: product.price,
          quantity: sku.quantity,
        };
        products.push({
          ...modifiedProduct,
          status: productStatus.notEnoughQuantity,
        });
      } else {
        modifiedProduct = product;
        products.push({ ...modifiedProduct, status: productStatus.available });
      }

      totalPrice += modifiedProduct.price * modifiedProduct.quantity;
    }

    return {
      products,
      totalPrice,
    };
  }
}
