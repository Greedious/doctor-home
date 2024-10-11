import { Controller, Param } from '@nestjs/common';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { FavoriteMobileService } from 'src/favorite/service/favorite-mobile.service';
import { FavoriteValidation } from '../validation';
import { Types } from 'src/account/user/data/user.schema';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { CurrentUser } from 'package/decorator/authorization/user.decorator';
import { IUser } from 'src/shared/types/user';
import { Params } from 'package/component/params/params';

@AuthenticatedController({
  controller: 'mobile/favorite',
})
export class FavoriteMobileController {
  constructor(
    private readonly favoriteMobileService: FavoriteMobileService,
    private readonly favoriteValidation: FavoriteValidation,
  ) {}

  // @AuthorizedApi({
  //   api: Api.POST,
  //   url: '/:productId',
  //   role: [Types.DOCTOR],
  //   privilege: [],
  // })
  // async addProductToFavorites(
  //   @Param() params: Params,
  //   @CurrentUser() user: IUser,
  // ) {
  //   this.favoriteValidation.paramsId({ params });
  //   await this.favoriteMobileService.addProductToFavorites(params.id, user.id);
  // }
}
