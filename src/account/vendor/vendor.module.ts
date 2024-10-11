import { Module, forwardRef } from '@nestjs/common';
import { VendorDashboardService } from './service/vendor-dashboard.service';
import { VendorDashboardController } from './api/controller/vendor-dashboard.controller';
import { VendorRepository } from './data/vendor.repository';
import { Vendor } from './data/vendor.schema';
import { UserModule } from '../user/user.module';
import { RoleModule } from 'src/role/role.module';
import { VendorValidation } from './api/validation';
import { VendorService } from './service/vendor.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([Vendor]),
    forwardRef(() => UserModule),
    RoleModule,
  ],
  providers: [
    VendorDashboardService,
    VendorRepository,
    VendorValidation,
    VendorService,
  ],
  controllers: [VendorDashboardController],
  exports: [VendorService, VendorDashboardService, VendorRepository],
})
export class VendorModule {}
