import { HttpStatus, Injectable } from '@nestjs/common';
import { VariantRepository } from '../data/variant.repository';
import { CreateVariant, UpdateVariant } from '../api/dto/request';
import { ProductRepository } from 'src/product/data/product.repository';
import { VariantError } from './variant-error.service';
import { ProductError } from 'src/product/service/product-error.service';

@Injectable()
export class VariantVendorService {
  constructor(
    private readonly variantRepository: VariantRepository,
    private readonly productRepository: ProductRepository,
    private readonly variantError: VariantError,
    private readonly productError: ProductError,
  ) {}

  async create(body: CreateVariant) {
    await this.productRepository.findOne({
      where: { id: body.productId },
      throwError: true,
      error: this.variantError.notFound(),
    });
    await this.variantRepository.create({
      doc: body,
    });
    return;
  }

  async update(body: UpdateVariant) {
    await this.productRepository.findOne({
      where: { id: body.productId },
      throwError: true,
      error: this.productError.notFound(),
    });

    const variant = await this.variantRepository.findOne({
      where: { id: body.id },
      throwError: true,
      error: this.variantError.notFound(),
    });
    await variant.update({
      ...body,
    });
    return;
  }

  async delete(id: number) {
    await this.variantRepository.delete({
      where: { id },
    });
    return;
  }
}
