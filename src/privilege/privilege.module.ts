import { Module } from '@nestjs/common';
import { PrivilegeService } from './service/privilege.service';
import { Privilege } from './data/privilege.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { PrivilegeRepository } from './data/privilege.repository';
import { PrivilegeDashboardController } from './api/controller/privilege-dashboard.controller';
import { PrivilegeValidation } from './api/validation';
import { PrivilegeDashboardService } from './service/privilege-dashboard.service';

@Module({
  imports: [SequelizeModule.forFeature([Privilege])],
  providers: [
    PrivilegeService,
    PrivilegeRepository,
    PrivilegeValidation,
    PrivilegeDashboardService,
  ],
  controllers: [PrivilegeDashboardController],
  exports: [PrivilegeService],
})
export class PrivilegeModule {}
