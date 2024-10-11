import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../data/category.repository';
import { CategoryError } from './category-error.service';
import { lastLevel } from '../data/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private categoryError: CategoryError,
  ) {}

  async findSubcategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, level: lastLevel },
      error: this.categoryError.notFound(),
    });
    return category;
  }
}
