import { Module, forwardRef } from '@nestjs/common';
import { UniversityOperatorDashboardService } from './service/operator-dashboard.service';
import { UniversityOperatorDashboardController } from './api/controller/operator-dashboard.controller';
import { UniversityOperatorRepository } from './data/operator.repository';
import { UniversityOperator } from './data/operator.schema';
import { RoleModule } from 'src/role/role.module';
import { UniversityOperatorValidation } from './api/validation';
import { UniversityOperatorService } from './service/operator.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from 'src/account/user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UniversityOperator]),
    forwardRef(() => UserModule),
    RoleModule,
  ],
  providers: [
    UniversityOperatorDashboardService,
    UniversityOperatorRepository,
    UniversityOperatorValidation,
    UniversityOperatorService,
  ],
  controllers: [UniversityOperatorDashboardController],
  exports: [UniversityOperatorService, UniversityOperatorDashboardService],
})
export class UniversityOperatorModule {}
