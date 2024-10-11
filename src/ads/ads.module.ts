import { Module } from '@nestjs/common';
import { AdsDashboardService } from './service/ads-dashboard.service';
import { PrivilegeModule } from 'src/privilege/privilege.module';
import { AdsError } from './service/ads-error.service';
import { AdsValidation } from './api/validation';
import { AdsRepository } from './data/ads.repository';
import { AdsDashboardController } from './api/controller/ads-dashboard.controller';
import { AdsService } from './service/ads.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ads } from './data/ads.schema';
import { AdsMobileService } from './service/ads-mobile.service';
import { AdsMobileController } from './api/controller/ads-mobile.controller';

@Module({
  imports: [SequelizeModule.forFeature([Ads])],
  controllers: [AdsDashboardController, AdsMobileController],
  providers: [
    AdsRepository,
    AdsDashboardService,
    AdsError,
    AdsValidation,
    AdsService,
    AdsMobileService,
  ],
  exports: [AdsService],
})
export class AdsModule {}
