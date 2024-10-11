import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types, User } from '../../data/user.schema';
import { UserValidation } from '../validation';
import { UserDashboardService } from '../../service/user-dasboard.service';
import { CurrentUser } from 'package/decorator/authorization/user.decorator';
import { Body } from '@nestjs/common';
@AuthenticatedController({
  controller: 'user',
})
export class UserDashboardController {
  constructor(
    private readonly userValidation: UserValidation,
    private readonly userDashboardService: UserDashboardService,
  ) {}

  @AuthorizedApi({
    api: Api.PATCH,
    privilege: [],
    role: [Types.ADMIN],
    url: '/edit-profile-operator',
  })
  async editProfileOperator(@Body() body: any, @CurrentUser() user: User) {
    body.id = user.id;
    this.userValidation.editProfileOperatorUser({ body });
    return this.userDashboardService.editProfileOperator(body);
  }
}
