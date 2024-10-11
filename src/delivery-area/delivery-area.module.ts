import { Module } from '@nestjs/common';
import { DeliveryAreaDashboardService } from './service/delivery-area-dashboard.service';
import { DeliveryAreaError } from './service/delivery-area-error.service';
import { DeliveryAreaValidation } from './api/validation';
import { DeliveryAreaRepository } from './data/delivery-area.repository';
import { DeliveryAreaDashboardController } from './api/controller/delivery-area-dashboard.controller';
import { DeliveryAreaService } from './service/delivery-area.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DeliveryArea } from './data/delivery-area.schema';
import { DeliveryAreaMobileService } from './service/delivery-area-mobile.service';
import { DeliveryAreaMobileController } from './api/controller/delivery-area-mobile.controller';

@Module({
  imports: [SequelizeModule.forFeature([DeliveryArea])],
  controllers: [DeliveryAreaDashboardController, DeliveryAreaMobileController],
  providers: [
    DeliveryAreaRepository,
    DeliveryAreaDashboardService,
    DeliveryAreaError,
    DeliveryAreaValidation,
    DeliveryAreaService,
    DeliveryAreaMobileService,
  ],
  exports: [DeliveryAreaService],
})
export class DeliveryAreaModule {}
