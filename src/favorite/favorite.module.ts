import { Module } from '@nestjs/common';
import { FavoriteMobileController } from './api/controller/favorite-mobile.controller';
import { FavoriteMobileService } from './service/favorite-mobile.service';
import { FavoriteRepository } from './data/favorite.repository';
import { Favorite } from './data/favorite.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { FavoriteValidation } from './api/validation';
import { FavoriteService } from './service/favorite.service';
import { FavoriteError } from './service/favorite-error.service';

@Module({
  imports: [SequelizeModule.forFeature([Favorite])],
  controllers: [FavoriteMobileController],
  providers: [
    FavoriteMobileService,
    FavoriteRepository,
    FavoriteValidation,
    FavoriteService,
    FavoriteError,
  ],
  exports: [FavoriteService],
})
export class FavoriteModule {}
