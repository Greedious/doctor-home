import { Module } from '@nestjs/common';
import { CategoryDashboardService } from './service/category-dashboard.service';
import { CategoryError } from './service/category-error.service';
import { CategoryValidation } from './api/validation';
import { CategoryRepository } from './data/category.repository';
import { CategoryDashboardController } from './api/controller/category-dashboard.controller';
import { CategoryService } from './service/category.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './data/category.schema';
import { CategoryMobileService } from './service/category-mobile.service';
import { CategoryMobileController } from './api/controller/category-mobile.controller';
import { CategoryVendorController } from './api/controller/category-vendor.controller';
import { CategoryVendorService } from './service/category-vendor.service';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  controllers: [
    CategoryDashboardController,
    CategoryMobileController,
    CategoryVendorController,
  ],
  providers: [
    CategoryRepository,
    CategoryDashboardService,
    CategoryError,
    CategoryValidation,
    CategoryService,
    CategoryMobileService,
    CategoryVendorService,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
