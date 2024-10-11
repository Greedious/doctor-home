import { Module, forwardRef } from '@nestjs/common';
import { OrderDashboardService } from './service/order-dashboard.service';
import { OrderError } from './service/order-error.service';
import { OrderValidation } from './api/validation';
import {
  OrderRepository,
  OrderedProductRepository,
} from './data/order.repository';
import { OrderDashboardController } from './api/controller/order-dashboard.controller';
import { OrderService } from './service/order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order, OrderedProduct } from './data/order.schema';
import { OrderMobileService } from './service/order-mobile.service';
import { OrderMobileController } from './api/controller/order-mobile.controller';
import { OrderVendorController } from './api/controller/order-vendor.controller';
import { OrderVendorService } from './service/order-vendor.service';
import { AddressModule } from 'src/address/address.module';
import { DeliveryAreaModule } from 'src/delivery-area/delivery-area.module';
import { SkuModule } from 'src/sku/sku.module';
import { DiscountModule } from 'src/discount/discount.module';
import { ProductModule } from 'src/product/product.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderedProduct]),
    AddressModule,
    DeliveryAreaModule,
    SkuModule,
    ProductModule,
    DiscountModule,
    ImageModule,
  ],
  controllers: [
    OrderDashboardController,
    OrderMobileController,
    OrderVendorController,
  ],
  providers: [
    OrderRepository,
    OrderedProductRepository,
    OrderDashboardService,
    OrderError,
    OrderValidation,
    OrderService,
    OrderMobileService,
    OrderVendorService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
