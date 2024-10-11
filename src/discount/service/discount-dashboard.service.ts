import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DiscountRepository } from '../data/discount.repository';
import { CreateDiscount, UpdateDiscount } from '../api/dto/request';
import { FilterService } from 'package/helpers/filtering-service';
import { orderCriteria } from 'package/utils/methods';
import { DiscountEntity } from '../api/dto/response/find-discounts-dashboard.dto';
import { GetAllDiscountsQuery } from '../api/dto/request';
import { GetByCriteria } from 'package/pagination/dto';
import { CategoryService } from 'src/category/service/category.service';
import { DiscountError } from './discount-error.service';

@Injectable()
export class DiscountDashboardService {
  constructor(
    private readonly discountRepository: DiscountRepository,
    private readonly categoryService: CategoryService,
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

  async count() {
    const discountCount = await this.discountRepository.count({});
    return discountCount;
  }

  async find(query: GetAllDiscountsQuery, pagination: GetByCriteria) {
    let limit = undefined,
      offset = undefined;
    if (pagination.needPagination) {
      limit = pagination.limit;
      offset = pagination.skip;
    }
    const { count, rows } = await this.discountRepository.findAndCount({
      where: this.helperMethods.filterFindDiscounts(query),
      options: {
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

  async findOne(id: number) {
    const discount = await this.discountRepository.findOne({
      where: { id },
      error: this.discountError.notFound(),
    });
    return discount;
  }

  async findOneByCode(code: string) {
    const discount = await this.discountRepository.findOne({ where: { code } });
    if (discount) {
      throw new HttpException(
        this.discountError.discountExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return discount;
  }

  async create(body: CreateDiscount) {
    if (body.subcategoryId) {
      await this.categoryService.findSubcategory(body.subcategoryId);
    }
    await this.findOneByCode(body.code);
    const discount = await this.discountRepository.create({
      doc: body,
    });
    return discount;
  }
  async patch(body: UpdateDiscount) {
    if (body.subcategoryId) {
      await this.categoryService.findSubcategory(body.subcategoryId);
    }
    const discount = await this.discountRepository.findOne({
      where: { id: body.id },
      throwError: true,
      error: this.discountError.notFound(),
    });
    await discount.update({
      ...body,
    });
    return;
  }
  async delete(body: { id: number }) {
    await this.discountRepository.destroy({
      where: { id: body.id },
    });
    return;
  }
}
