import { Injectable } from '@nestjs/common';
import { DiscountRepository } from '../data/discount.repository';
import { getLimitAndOffset, orderCriteria } from 'package/utils/methods';
import { FilterService } from 'package/helpers/filtering-service';
import { DiscountEntity } from '../api/dto/response/find-discounts-dashboard.dto';
import { GetAllDiscountsQuery } from '../api/dto/request';
import { GetByCriteria } from 'package/pagination/dto';
import { Vendor } from 'src/account/vendor/data/vendor.schema';
import { ProductDto } from 'src/product/api/dto/request';
import { Discount } from '../data/discount.schema';
import { DiscountError } from './discount-error.service';

@Injectable()
export class DiscountService {
  constructor(
    private readonly discountRepository: DiscountRepository,
    private readonly discountError: DiscountError,
  ) {}

  private helperMethods = {
    filterFindDiscounts(query: GetAllDiscountsQuery) {
      const { subcategoryId } = query;
      const filterService = new FilterService();
      if (subcategoryId) filterService.equals('subcategoryId', subcategoryId);
      return filterService.get();
    },
  };

  async checkCoupon(coupon: string, products: ProductDto[]) {
    const discount = await this.discountRepository.findOne({
      where: { code: coupon },
      error: this.discountError.notFound(),
    });
    const { totalPriceWithDiscount } = this.useCoupon(discount, products);
    return {
      discountId: discount.id,
      totalPriceWithDiscount,
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

  // I added also in mobile if we need to modify the response for mobile
  async find(query: GetAllDiscountsQuery, pagination: GetByCriteria) {
    const { limit, offset } = getLimitAndOffset(pagination);
    const { count, rows } = await this.discountRepository.findAndCount({
      where: this.helperMethods.filterFindDiscounts(query),
      options: {
        include: [Vendor],
        order: orderCriteria(query),
        limit,
        offset,
      },
    });
    return {
      count,
      rows: rows.map((discount) => new DiscountEntity({ discount }).toObject()),
    };
  }
}
