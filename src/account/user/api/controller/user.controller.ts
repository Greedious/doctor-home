import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { UserService } from '../../service/user.service';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Body } from '@nestjs/common';
import { EditProfileDoctorUser } from 'src/account/doctor/api/dto/request';
import { CurrentUser } from 'package/decorator/authorization/user.decorator';
import { Types, User } from '../../data/user.schema';
import { UserValidation } from '../validation';
import { UserDashboardService } from '../../service/user-dasboard.service';

@AuthenticatedController({
  controller: 'mobile/user',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidation: UserValidation,
  ) {}

  @AuthorizedApi({
    api: Api.PATCH,
    privilege: [],
    role: [Types.DOCTOR],
    url: '/edit-profile-doctor',
  })
  async editProfileDoctor(
    @Body() body: EditProfileDoctorUser,
    @CurrentUser() user: User,
  ) {
    body.id = user.id;
    this.userValidation.editProfileDoctorUser({ body });
    return await this.userService.editProfileDoctor(body);
  }
}
