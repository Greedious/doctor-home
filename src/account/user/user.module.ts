import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './service/user.service';
import { RoleModule } from 'src/role/role.module';
import { User } from './data/user.schema';
import { UserRepository } from './data/user.repository';
import { UserError } from './service/user-error.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoctorModule } from '../doctor/doctor.module';
import { UserValidation } from './api/validation';
import { UserController } from './api/controller/user.controller';
import { OperatorModule } from '../operator/operator.module';
import { UserDashboardService } from './service/user-dasboard.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    RoleModule,
    DoctorModule,
    forwardRef(() => OperatorModule),
  ],
  providers: [
    UserService,
    UserRepository,
    UserError,
    UserValidation,
    UserDashboardService,
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository, UserError, UserDashboardService],
})
export class UserModule {}
