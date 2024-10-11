import { Module, forwardRef } from '@nestjs/common';
import { DiscountDashboardController } from './api/controller/discount-dashboard.controller';
import { DiscountService } from './service/discount.service';
import { DiscountRepository } from './data/discount.repository';
import { DiscountDashboardService } from './service/discount-dashboard.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Discount } from './data/discount.schema';
import { VendorModule } from 'src/account/vendor/vendor.module';
import { Vendor } from 'src/account/vendor/data/vendor.schema';
import { DiscountValidation } from './api/validation';
import { DiscountMobileController } from './api/controller/discount-mobile.controller';
import { DiscountMobileService } from './service/discount-mobile.service';
import { ProductModule } from 'src/product/product.module';
import { SkuModule } from 'src/sku/sku.module';
import { DiscountError } from './service/discount-error.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Discount]),
    forwardRef(() => ProductModule),
    CategoryModule,
    SkuModule,
  ],
  controllers: [DiscountMobileController, DiscountDashboardController],
  providers: [
    DiscountError,
    DiscountMobileService,
    DiscountService,
    DiscountDashboardService,
    DiscountRepository,
    DiscountValidation,
  ],
  exports: [DiscountService],
})
export class DiscountModule {}
