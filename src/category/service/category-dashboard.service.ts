import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateCategoryRequest,
  CreateSubcategoryRequest,
  UpdateCategory,
  UpdateCategoryRequest,
} from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { CategoryError } from './category-error.service';
import { Category, lastLevel } from 'src/category/data/category.schema';
import { CategoryRepository } from '../data/category.repository';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { Image } from 'src/image/data/image.schema';

@Injectable()
export class CategoryDashboardService {
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

  async findCategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, level: 0 },
      include: [
        Image,
        {
          model: Category,
          as: 'subcategories',
        },
      ],
      error: this.categoryError.notFound(),
    });
    return category;
  }

  async findAll(filter: WhereOptions<Category>) {
    const categories = await this.categoryRepository.findAll({
      where: filter,
      include: [
        Image,
        {
          model: Category,
          as: 'subcategories',
        },
      ],
    });

    return categories;
  }

  async delete({ id }: Params) {
    await this.categoryRepository.delete({
      where: { [Op.or]: [{ id }, { parentId: id }] },
    });
    return;
  }

  async createSubcategory(body: CreateSubcategoryRequest, { id }: Params) {
    const category = await this.categoryRepository.create({
      doc: {
        ...body,
        parentId: id,
      },
    });
    return { id: category.id };
  }

  async create(body: CreateCategoryRequest) {
    const category = await this.categoryRepository.create({
      doc: {
        name: body.name,
        imageId: body.image,
        level: 0,
      },
    });
    const subcategories = body.subcategories.map((subcategory) => {
      return {
        name: subcategory.name,
        level: 1,
        parentId: category.id,
      };
    });

    await this.categoryRepository.bulkCreate({ doc: subcategories });

    return {
      id: category.id,
    };
  }

  async update(body: UpdateCategory, params: Params, category: Category) {
    if (category.level === lastLevel && body.imageId) {
      throw new HttpException(
        this.categoryError.notFound(),
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.categoryRepository.update({
      where: { id: params.id },
      update: body,
    });
    return;
  }
}
