import { Injectable } from '@nestjs/common';

import { SkuError } from './sku-error.service';
import { SkuProduct } from 'src/sku/data/sku.schema';
import { SkuRepository } from '../data/sku.repository';
import { Op, WhereOptions } from 'sequelize';
import { SkuParam } from '../api/dto/request';
import { Image } from 'src/image/data/image.schema';

@Injectable()
export class SkuMobileService {
  constructor(
    private skuRepository: SkuRepository,
    private skuError: SkuError,
  ) {}

  // async findOneById(id: number) {
  //   const sku = await this.skuRepository.findOne({
  //     where: { id },
  //     error: this.skuError.notFound(),
  //   });
  //   return sku;
  // }

  // async findOne({ id }: Params) {
  //   const sku = await this.skuRepository.findOne({
  //     where: { id },
  //     error: this.skuError.notFound(),
  //   });

  //   return sku;
  // }

  async findOne(
    { productId }: SkuParam,
    skuProductFilter: WhereOptions<SkuProduct>[],
  ) {
    const skus = await this.skuRepository.findOne({
      where: { productId },
      include: [
        Image,
        {
          model: SkuProduct,
          where: {
            [Op.and]: skuProductFilter,
          },
        },
      ],
      error: this.skuError.notFound(),
    });

    return skus;
  }
}
