import { Module } from '@nestjs/common';
import { AddressMobileController } from './api/controller/address-mobile.controller';
import { AddressMobileService } from './service/address-mobile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './data/address.schema';
import { AddressValidation } from './api/validation';
import { UserModule } from 'src/account/user/user.module';
import { AddressRepository } from './data/address.repository';
import { User } from 'src/account/user/data/user.schema';
import { AddressDashboardService } from './service/address-dashboard.service';
import { AddressDashboardController } from './api/controller/address-dashboard.controller';
import { AddressError } from './service/address-error.service';

@Module({
  imports: [SequelizeModule.forFeature([Address, User]), UserModule],
  controllers: [AddressMobileController, AddressDashboardController],
  providers: [
    AddressMobileService,
    AddressDashboardService,
    AddressValidation,
    AddressRepository,
    AddressError,
  ],
  exports: [AddressMobileService, AddressDashboardService],
})
export class AddressModule {}
