import { Module } from '@nestjs/common';
import { RoleDashboardService } from './service/role-dashboard.service';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { RoleError } from './service/role-error.service';
import { RoleValidation } from './api/validation';
import { RoleRepository } from './data/role.repository';
import { RoleDashboardController } from './api/controller/role-dashboard.controller';
import { RoleService } from './service/role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role, RolePrivilege } from './data/role.schema';

@Module({
  imports: [SequelizeModule.forFeature([Role, RolePrivilege]), PrivilegeModule],
  controllers: [RoleDashboardController],
  providers: [
    RoleRepository,
    RoleDashboardService,
    RoleError,
    RoleValidation,
    RoleService,
  ],
  exports: [RoleService],
})
export class RoleModule {}
