import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FavoriteRepository } from '../data/favorite.repository';
import { IUser } from 'src/shared/types/user';
import { UpdateFavoriteProduct } from 'src/product/api/dto/request';
import { FavoriteError } from './favorite-error.service';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly favoriteError: FavoriteError,
  ) {}

  async addOrRemoveProductFavorites(user: IUser, productId: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId: user.id, productId },
    });
    if (favorite) {
      await favorite.destroy();
      return false;
    } else {
      await this.favoriteRepository.create({
        doc: { userId: user.id, productId },
      });
      return true;
    }
  }
}
