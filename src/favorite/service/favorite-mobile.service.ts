import { Injectable } from '@nestjs/common';
import { FavoriteRepository } from '../data/favorite.repository';
import { ProductRepository } from 'src/product/data/product.repository';
import { WhereOptions } from 'sequelize';
import { Product } from 'src/product/data/product.schema';
import { GetByCriteria } from 'package/pagination/dto';
import { Favorite } from '../data/favorite.schema';

@Injectable()
export class FavoriteMobileService {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async isProductInUserFavorites(userId: number, productId: number) {
    const count = await this.favoriteRepository.count({
      where: { userId, productId },
    });
    return count > 0;
  }
  async addOrRemoveFavorites(userId: number, productId: number) {
    await Favorite.create({
      userId,
      productId,
    });
    return;
  }
}
