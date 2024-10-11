import { Controller, Post } from '@nestjs/common';
import { OperatorService } from 'src/account/operator/service/operator.service';
import { UserService } from 'src/account/user/service/user.service';
import { PrivilegeService } from 'src/privilege/service/privilege.service';
import { RoleService } from 'src/role/service/role.service';
import { UniversityOperatorService } from 'src/university/account/operator/service/operator.service';
import { StatusService } from 'src/university/status/service/status.service';
@Controller('database')
export class DatabaseController {
  constructor(
    private readonly roleService: RoleService,
    private readonly privilegeService: PrivilegeService,
    private readonly userService: UserService,
    private readonly operatorService: OperatorService,
    private readonly universityOperatorService: UniversityOperatorService,
    private readonly statusService: StatusService,
  ) {}
  @Post('seed')
  async seedData() {
    // !! the order of calling functions is important
    await this.privilegeService.seed();
    await this.roleService.seed();

    await this.userService.seed();
    await this.operatorService.seed();
    await this.universityOperatorService.seed();
    // await this.statusService.seed();
  }
}
