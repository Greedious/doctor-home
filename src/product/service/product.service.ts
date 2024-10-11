import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../data/product.repository';
import { ProductError } from './product-error.service';
import { Sku } from 'src/sku/data/sku.schema';
import { SkuService } from 'src/sku/service/sku.service';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private skuService: SkuService,
    private productError: ProductError,
  ) {}

  async findOne(id: number) {
    return await this.productRepository.findOne({
      where: { id },
      error: this.productError.notFound(),
    });
  }

  async updateProductQuantity(products: { id: number; quantity: number }[]) {
    // await this.skuService.
  }
}
