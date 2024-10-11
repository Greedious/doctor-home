import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Product } from './product.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProductRepository extends SequelizeRepository<Product> {
  constructor(
    @InjectModel(Product)
    productRepository: typeof Product,
  ) {
    super(productRepository);
  }
}
