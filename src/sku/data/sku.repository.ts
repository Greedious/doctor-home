import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Sku, SkuProduct } from './sku.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SkuRepository extends SequelizeRepository<Sku> {
  constructor(
    @InjectModel(Sku)
    skuRepository: typeof Sku,
  ) {
    super(skuRepository);
  }
}
@Injectable()
export class SkuProductRepository extends SequelizeRepository<SkuProduct> {
  constructor(
    @InjectModel(SkuProduct)
    skuProductRepository: typeof SkuProduct,
  ) {
    super(skuProductRepository);
  }
}
