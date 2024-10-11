import { Module, forwardRef } from '@nestjs/common';
import { ReviewDashboardController } from './api/controller/review-dashboard.controller';
import { ReviewService } from './service/review.service';
import { ReviewRepository } from './data/review.repository';
import { ReviewDashboardService } from './service/review-dashboard.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './data/review.schema';
import { VendorModule } from 'src/account/vendor/vendor.module';
import { Vendor } from 'src/account/vendor/data/vendor.schema';
import { ReviewValidation } from './api/validation';
import { ReviewMobileController } from './api/controller/review-mobile.controller';
import { ReviewMobileService } from './service/review-mobile.service';
import { ProductModule } from 'src/product/product.module';
import { SkuModule } from 'src/sku/sku.module';
import { ReviewError } from './service/review-error.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Review]),
    forwardRef(() => ProductModule),
    CategoryModule,
    SkuModule,
  ],
  controllers: [ReviewMobileController, ReviewDashboardController],
  providers: [
    ReviewError,
    ReviewMobileService,
    ReviewService,
    ReviewDashboardService,
    ReviewRepository,
    ReviewValidation,
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
