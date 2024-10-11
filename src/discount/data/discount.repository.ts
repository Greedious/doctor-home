import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Discount } from './discount.schema';

@Injectable()
export class DiscountRepository extends SequelizeRepository<Discount> {
  constructor(
    @InjectModel(Discount)
    discountRepository: typeof Discount,
  ) {
    super(discountRepository);
  }
}
