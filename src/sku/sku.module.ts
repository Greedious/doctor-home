import { Module, forwardRef } from '@nestjs/common';
import { SkuVendorService } from './service/sku-vendor.service';
import { SkuError } from './service/sku-error.service';
import { SkuValidation } from './api/validation';
import { SkuProductRepository, SkuRepository } from './data/sku.repository';
import { SkuVendorController } from './api/controller/sku-vendor.controller';
import { SkuService } from './service/sku.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sku, SkuProduct } from './data/sku.schema';
import { SkuMobileService } from './service/sku-mobile.service';
import { SkuMobileController } from './api/controller/sku-mobile.controller';
import { CategoryModule } from 'src/category/category.module';
import { VariantModule } from 'src/variant/variant.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Sku, SkuProduct]),
    CategoryModule,
    forwardRef(() => VariantModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [SkuVendorController, SkuMobileController],
  providers: [
    SkuRepository,
    SkuProductRepository,
    SkuVendorService,
    SkuError,
    SkuValidation,
    SkuService,
    SkuMobileService,
  ],
  exports: [SkuService, SkuRepository],
})
export class SkuModule {}
