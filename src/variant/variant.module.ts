import { Module, forwardRef } from '@nestjs/common';
import { VariantService } from './service/variant.service';
import { VariantController } from './api/controller/variant.controller';
import { VariantVendorController } from './api/controller/variant-vendor.controller';
import { VariantVendorService } from './service/variant-dashboard.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Variant } from './data/variant.schema';
import { Product } from 'src/product/data/product.schema';
import { ProductModule } from 'src/product/product.module';
import { VariantValidation } from './api/validation';
import { VariantRepository } from './data/variant.repository';
import { VariantError } from './service/variant-error.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Variant, Product]),
    forwardRef(() => ProductModule),
  ],
  providers: [
    VariantService,
    VariantVendorService,
    VariantValidation,
    VariantRepository,
    VariantError,
  ],
  controllers: [VariantController, VariantVendorController],
  exports: [VariantService],
})
export class VariantModule {}
