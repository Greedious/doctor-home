import { Injectable } from '@nestjs/common';
import { SkuError } from './sku-error.service';
import { CategoryService } from 'src/category/service/category.service';
import { SkuRepository } from '../data/sku.repository';
import { CreateSkuRequest } from '../api/dto/request';
import { IUser } from 'src/shared/types/user';

@Injectable()
export class SkuVendorService {
  constructor(
    private skuRepository: SkuRepository,
    private categoryService: CategoryService,
    private skuError: SkuError,
  ) {}

  // async validateSubcategory(id: number) {
  //   return await this.categoryService.findSubcategory(id);
  // }

  // async findOneById(id: number) {
  //   const sku = await this.skuRepository.findOne({
  //     where: { id },
  //     error: this.skuError.notFound(),
  //   });
  //   return sku;
  // }

  // async findAll(filter: WhereOptions<Sku>) {
  //   const skus = await this.skuRepository.findAll({
  //     where: filter,
  //     include: [
  //       {
  //         model: Sku,
  //         as: 'subskus',
  //       },
  //     ],
  //   });

  //   return skus;
  // }

  // async delete({ id }: Params) {
  //   await this.skuRepository.delete({
  //     where: { [Op.or]: [{ id }] },
  //   });
  //   return;
  // }

  async create(body: CreateSkuRequest, user: IUser) {
    const { price, quantity, image, product } = body;
    const sku = await this.skuRepository.create({
      doc: {
        price,
        quantity,
        imageId: image,
        productId: product,
      },
    });
    return { id: sku.id };
  }

  // async update(body: UpdateSku, { id }: Params) {
  //   await this.skuRepository.update({
  //     where: { id },
  //     update: body,
  //   });
  //   return;
  // }
}
