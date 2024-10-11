import { Module, forwardRef } from '@nestjs/common';
import { OperatorDashboardService } from './service/operator-dashboard.service';
import { OperatorDashboardController } from './api/controller/operator-dashboard.controller';
import { OperatorRepository } from './data/operator.repository';
import { Operator } from './data/operator.schema';
import { UserModule } from '../user/user.module';
import { RoleModule } from 'src/role/role.module';
import { OperatorValidation } from './api/validation';
import { OperatorService } from './service/operator.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OperatorError } from './service/operator-error.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Operator]),
    forwardRef(() => UserModule),
    RoleModule,
  ],
  providers: [
    OperatorDashboardService,
    OperatorRepository,
    OperatorValidation,
    OperatorService,
    OperatorError,
  ],
  controllers: [OperatorDashboardController],
  exports: [OperatorService, OperatorDashboardService],
})
export class OperatorModule {}
