import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Favorite } from './favorite.schema';

@Injectable()
export class FavoriteRepository extends SequelizeRepository<Favorite> {
  constructor(
    @InjectModel(Favorite)
    favoriteRepository: typeof Favorite,
  ) {
    super(favoriteRepository);
  }
}
