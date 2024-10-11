import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SkuProductRepository, SkuRepository } from '../data/sku.repository';
import { SkuError } from './sku-error.service';
import { VariantService } from 'src/variant/service/variant.service';
import { CreateSkuRequest } from '../api/dto/request';
import { Transaction, WhereOptions } from 'sequelize';
import { Sku } from '../data/sku.schema';
import { Op } from 'sequelize';
import { ProductDto, productStatus } from 'src/product/api/dto/request';
import { Product } from 'src/product/data/product.schema';
import { ProductError } from 'src/product/service/product-error.service';
import { Image } from 'src/image/data/image.schema';

@Injectable()
export class SkuService {
  constructor(
    private skuRepository: SkuRepository,
    private skuProductRepository: SkuProductRepository,
    private variantService: VariantService,
    private skuError: SkuError,
    private productError: ProductError,
  ) {}

  async updateQuantity(
    {
      products,
      inc,
    }: { products: { id: number; quantity: number }[]; inc: boolean },
    transaction: Transaction,
  ) {
    for (const product of products) {
      const sign = inc ? 1 : -1;
      const sku = await this.skuRepository.findOne({
        where: {
          id: product.id,
          quantity: { [Op.gte]: sign * product.quantity },
        },
        include: [Product],
        error: this.skuError.notFound(),
      });
      sku.quantity = product.quantity * sign + sku.quantity;
      sku.product.quantity = sku.product.quantity + product.quantity * sign;
      await sku.save({ transaction });
      await sku.product.save({ transaction });
    }
  }

  async findAll(query: { productId: number }) {
    const { productId } = query;
    const skus = await this.skuRepository.findAll({ where: { productId } });
    return skus;
  }

  async findOneById(id: number) {
    const product = await this.skuRepository.findOne({
      where: { id, quantity: { [Op.gt]: 0 } },
      include: [{ model: Product }, Image],
    });
    return product;
  }

  async createSkusProduct(
    body: { key: string; productVariantId: number; value: string }[],
    skuId: number,
    transaction: Transaction,
  ) {
    const createdIds: number[] = [];
    for (const skuProduct of body) {
      const created = await this.skuProductRepository.create({
        doc: {
          key: skuProduct.key,
          value: skuProduct.value,
          productVariantId: skuProduct.productVariantId,
          skuId,
        },
        options: { transaction },
      });
      createdIds.push(created.id);
    }
    return createdIds;
  }
  async create(body: CreateSkuRequest[], transaction: Transaction) {
    const ids: number[] = [];
    for (const sku of body) {
      const createdSku = await this.skuRepository.create({
        doc: {
          price: sku.price,
          imageId: sku.image,
          quantity: sku.quantity,
          productId: sku.product,
        },
        options: { transaction },
      });

      const skusProductIds = await this.createSkusProduct(
        sku.skusProduct,
        createdSku.id,
        transaction,
      );

      await createdSku.$set('skusProduct', skusProductIds, { transaction });
      ids.push(createdSku.id);
    }
    return ids;
  }
  async deleteWhere(deleteWhere: WhereOptions<Sku>, transaction?: Transaction) {
    await this.skuRepository.destroy({
      where: deleteWhere,
      options: { transaction },
    });
    return;
  }

  async checkProduct(products: ProductDto[], transaction?: Transaction) {
    const resultProducts: ProductDto[] = [];
    let totalPrice = 0;
    let totalQuantity = 0;
    let isCompleteOrder = true;
    for (const product of products) {
      const sku = await this.findOneById(product.id);

      let modifiedProduct: ProductDto;
      if (!sku || sku.quantity === 0) {
        modifiedProduct = {
          id: product.id,
          price: product.price,
          quantity: 0,
          subcategory: sku?.product?.subcategoryId || undefined,
        };
        resultProducts.push({
          ...modifiedProduct,
          status: productStatus.outOfStock,
        });
        isCompleteOrder = false;
      } else if (sku.price !== product.price) {
        modifiedProduct = {
          id: sku.id,
          price: sku.price,
          quantity: Math.min(product.quantity, sku.quantity),
          subcategory: sku.product?.subcategoryId,
        };
        resultProducts.push({
          ...modifiedProduct,
          status: productStatus.changedPrice,
        });
        isCompleteOrder = false;
      } else if (sku.quantity < product.quantity && sku.quantity !== 0) {
        modifiedProduct = {
          id: product.id,
          price: product.price,
          quantity: sku.quantity,
          subcategory: sku.product?.subcategoryId,
        };
        resultProducts.push({
          ...modifiedProduct,
          status: productStatus.notEnoughQuantity,
        });
        isCompleteOrder = false;
      } else {
        modifiedProduct = {
          id: product.id,
          price: product.price,
          quantity: product.quantity,
          subcategory: sku.product?.subcategoryId,
        };
        resultProducts.push({
          ...modifiedProduct,
          image: sku.image.key,
          name: sku.product?.name,
          status: productStatus.available,
        });
      }
      //todo update quantity of the products and skus
      totalPrice += modifiedProduct.price * modifiedProduct.quantity;
      totalQuantity += modifiedProduct.quantity;
    }

    if (!isCompleteOrder) {
      throw new HttpException(
        this.productError.changeInCard({
          resultProducts,
        }),
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      resultProducts,
      totalPrice,
      totalQuantity,
    };
  }
}
