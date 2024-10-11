import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CategoryError } from './category-error.service';
import { Category } from 'src/category/data/category.schema';
import { CategoryRepository } from '../data/category.repository';
import { WhereOptions } from 'sequelize';
import { Params } from 'package/component/params/params';
import { Image } from 'src/image/data/image.schema';

@Injectable()
export class CategoryVendorService {
  constructor(
    private categoryRepository: CategoryRepository,
    private categoryError: CategoryError,
  ) {}

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      error: this.categoryError.notFound(),
    });
    return category;
  }

  async findOne({ id }: Params) {
    const category = await this.categoryRepository.findOne({
      where: { id, level: 0 },
      error: this.categoryError.notFound(),
      include: [
        {
          model: Category,
          as: 'subcategories',
        },
      ],
    });

    if (!category.subcategories.length) {
      throw new HttpException(
        this.categoryError.notFound(),
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async findAll(filter: WhereOptions<Category>) {
    const categories = await this.categoryRepository.findAll({
      where: filter,
      include: [
        {
          model: Category,
          as: 'subcategories',
        },
        Image,
      ],
    });

    return categories;
  }
}
