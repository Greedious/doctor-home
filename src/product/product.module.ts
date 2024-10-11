import { Module, forwardRef } from '@nestjs/common';
import { ProductDashboardService } from './service/product-dashboard.service';
import { ProductError } from './service/product-error.service';
import { ProductValidation } from './api/validation';
import { ProductRepository } from './data/product.repository';
import { ProductController } from './api/controller/product.controller';
import { ProductService } from './service/product.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './data/product.schema';
import { ProductMobileService } from './service/product-mobile.service';
import { ProductMobileController } from './api/controller/product-mobile.controller';
import { CategoryModule } from 'src/category/category.module';
import { VariantModule } from 'src/variant/variant.module';
import { SkuModule } from 'src/sku/sku.module';
import { VendorModule } from 'src/account/vendor/vendor.module';
import { ImageModule } from 'src/image/image.module';
import { OperatorModule } from 'src/account/operator/operator.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    CategoryModule,
    forwardRef(() => VariantModule),
    VendorModule,
    ImageModule,
    SkuModule,
    OperatorModule,
    FavoriteModule,
  ],
  controllers: [ProductController, ProductMobileController],
  providers: [
    ProductRepository,
    ProductDashboardService,
    ProductError,
    ProductValidation,
    ProductService,
    ProductMobileService,
  ],
  exports: [ProductService, ProductRepository, ProductError],
})
export class ProductModule {}
