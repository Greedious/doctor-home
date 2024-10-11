import { Module } from '@nestjs/common';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { RoleModule } from 'src/role/role.module';
import { DatabaseController } from './api/controller/database.controller';
import { UserModule } from 'src/account/user/user.module';
import { OperatorModule } from 'src/account/operator/operator.module';
import { UniversityOperatorModule } from 'src/university/account/operator/operator.module';
import { StatusModule } from 'src/university/status/status.module';

@Module({
  imports: [
    RoleModule,
    PrivilegeModule,
    UserModule,
    OperatorModule,
    UniversityOperatorModule,
    StatusModule,
  ],
  controllers: [DatabaseController],
  exports: [],
})
export class DatabaseModule {}
