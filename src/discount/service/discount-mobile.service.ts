import { Injectable } from '@nestjs/common';
import { DiscountRepository } from '../data/discount.repository';
import { CheckCoupon } from '../api/dto/request';
import { SkuService } from 'src/sku/service/sku.service';
import { DiscountError } from './discount-error.service';
import { Discount } from '../data/discount.schema';
import { ProductDto } from 'src/product/api/dto/request';
import { ProductError } from 'src/product/service/product-error.service';

@Injectable()
export class DiscountMobileService {
  constructor(
    private readonly discountRepository: DiscountRepository,
    private readonly discountError: DiscountError,
    private readonly productError: ProductError,
    private skuService: SkuService,
  ) {}

  async checkCoupon(body: CheckCoupon) {
    const discount = await this.discountRepository.findOne({
      where: { code: body.code },
      error: this.discountError.notFound(),
    });
    const { resultProducts, totalPrice } = await this.skuService.checkProduct(
      body.products,
    );

    const { totalPriceWithDiscount } = this.useCoupon(discount, resultProducts);

    return {
      resultProducts,
      totalPrice,
      totalPriceWithDiscount,
      delivery: 0,
      discount: totalPrice - totalPriceWithDiscount,
    };
  }

  useCoupon(coupon: Discount, products: ProductDto[]) {
    let productsWithDiscount = 0;
    //the total price of the products when discount is applied
    let productsWithoutDiscount = 0;
    for (const product of products) {
      if (this.canApplyCoupon(coupon, product)) {
        productsWithDiscount += product.price * product.quantity;
      } else {
        productsWithoutDiscount += product.price * product.quantity;
      }
    }

    productsWithDiscount =
      productsWithDiscount -
      coupon.value -
      productsWithDiscount * (coupon.percentage / 100);

    const totalPriceWithDiscount =
      productsWithDiscount + productsWithoutDiscount;

    return {
      totalPriceWithDiscount,
      productsWithDiscount,
      productsWithoutDiscount,
    };
  }

  canApplyCoupon(coupon: Discount, product: ProductDto) {
    return product.subcategory === coupon.subcategoryId; //|| product.vendor === coupon.subcategory
  }
}
