import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Category } from './category.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CategoryRepository extends SequelizeRepository<Category> {
  constructor(
    @InjectModel(Category)
    categoryRepository: typeof Category,
  ) {
    super(categoryRepository);
  }
}
