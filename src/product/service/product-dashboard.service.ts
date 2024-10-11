import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateProductRequest,
  ProductSku,
  UpdateProductRequest,
  ProductVariant,
} from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { ProductError } from './product-error.service';
import { Product } from 'src/product/data/product.schema';
import { ProductRepository } from '../data/product.repository';
import { Includeable, Transaction, WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { CategoryService } from 'src/category/service/category.service';
import { IUser } from 'src/shared/types/user';
import { VariantService } from 'src/variant/service/variant.service';
import { SkuService } from 'src/sku/service/sku.service';
import { CreateVariant } from 'src/variant/api/dto/request';
import { CreateSkuRequest } from 'src/sku/api/dto/request';
import { JObject } from 'package/utils/interfaces';
import { ImageService } from 'src/image/service/image.service';
import { ProductValidation } from '../api/validation';
import { Sku, SkuProduct } from 'src/sku/data/sku.schema';
import { OperatorDashboardService } from 'src/account/operator/service/operator-dashboard.service';
import { Favorite } from 'src/favorite/data/favorite.schema';
import { Image } from 'src/image/data/image.schema';
import { Category } from 'src/category/data/category.schema';
import { Variant } from 'src/variant/data/variant.schema';

@Injectable()
export class ProductDashboardService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly variantService: VariantService,
    private readonly skuService: SkuService,
    private readonly productError: ProductError,
    private readonly imageService: ImageService,
    private readonly productValidation: ProductValidation,
    private readonly operatorDashboardService: OperatorDashboardService,
  ) {}

  async clearOldVariantsAndSkus(productId: number, transaction: Transaction) {
    const variants = await this.variantService.findAll(
      { productId },
      transaction,
    );
    const skus = await this.skuService.findAll({ productId });
    const variantsIds = variants.map((variant) => variant.id);
    const skusIds = skus.map((sku) => sku.id);
    await SkuProduct.destroy({
      where: {
        [Op.or]: [
          { productVariantId: { [Op.in]: variantsIds } },
          { skuId: { [Op.in]: skusIds } },
        ],
      },
      transaction,
    });

    await this.variantService.deleteWhere(
      { id: { [Op.in]: variantsIds } },
      transaction,
    );
    await this.skuService.deleteWhere(
      { id: { [Op.in]: skusIds } },
      transaction,
    );
    return;
  }
  async validateSubcategory(id: number) {
    return await this.categoryService.findSubcategory(id);
  }

  async findOneById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      error: this.productError.notFound(),
    });
    return product;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      include: [
        Image,
        {
          association: 'category',
          as: 'category',
          include: [{ association: 'image' }],
        },
        {
          association: 'subcategory',
          as: 'subcategory',
          include: [{ association: 'image' }],
        },
        Variant,
        {
          association: 'skus',
          include: [{ association: 'skusProduct' }, { association: 'image' }],
        },
      ],
      error: this.productError.notFound(),
    });
    return product;
  }

  async findAll(
    filter: WhereOptions<Product>,
    { limit, skip }: { limit: number; skip: number },
  ) {
    const include: Includeable | Includeable[] = [Image];

    const products = await this.productRepository.findAndCount({
      where: filter,
      options: { limit, offset: skip, distinct: true },
      include,
    });
    return products;
  }

  async delete(id: number, transaction: Transaction) {
    await this.productRepository.delete({
      where: { [Op.or]: [{ id }] },
      options: { transaction },
    });
    return;
  }

  async create(
    body: CreateProductRequest,
    user: IUser,
    transaction: Transaction,
  ) {
    const { name, description, price, variants, image, stockKeepUnits } = body;
    // validating if each sku variant name is one of the variants names
    this.productValidation.validateSentSkusVariants(
      body.variants,
      body.stockKeepUnits,
    );

    const subcategory = await this.categoryService.findSubcategory(
      body.subcategory,
    );
    // calculating the total sum of quantities of all "stock keep units" of this product
    const totalQuantity = stockKeepUnits.reduce(
      (sum: number, sku: ProductSku) => {
        return sum + sku.quantity;
      },
      0,
    );
    const operator = await this.operatorDashboardService.findOneById(user.id);

    const product = await this.productRepository.create({
      doc: {
        name,
        description,
        mainPrice: price,
        quantity: totalQuantity,
        operator: operator.id,
        subcategoryId: subcategory.id,
        categoryId: subcategory.parentId,
        imageId: image,
      },
      options: { transaction },
    });

    // creating the variants and attaching them to the product
    const variantsIds = await this.createVariants(
      variants,
      product.id,
      transaction,
    );
    await product.$set('variants', variantsIds, { transaction });

    const nameIdMappingObj: JObject = {};

    console.assert(variantsIds.length === variants.length);
    for (let i = 0; i < variants.length; i++) {
      nameIdMappingObj[variants[i].name.en] = variantsIds[i];
    }
    console.log({ variants, variantsIds });
    console.log({ nameIdMappingObj });

    // creating the skus related to product
    const skusIds = await this.createSku(
      stockKeepUnits,
      product.id,
      nameIdMappingObj,
      transaction,
    );
    await product.$set('skus', skusIds, { transaction });
    console.log(skusIds);
    if (skusIds.length) product.defaultSkuId = skusIds[0];
    await product.save({ transaction });

    return { id: product.id };
  }

  async createVariants(
    body: ProductVariant[],
    productId: number,
    transaction: Transaction,
  ) {
    const normalizedCreateArray: CreateVariant[] = body.map(
      (variant: ProductVariant) => {
        return { ...variant, productId: productId };
      },
    );
    return await this.variantService.create(normalizedCreateArray, transaction);
  }

  async createSku(
    body: ProductSku[],
    productId: number,
    nameIdMappingObj: JObject,
    transaction: Transaction,
  ) {
    const normalizedCreateArray: CreateSkuRequest[] = body.map(
      (sku: ProductSku) => {
        return {
          image: sku.image,
          price: sku.price,
          product: productId,
          quantity: sku.quantity,
          skusProduct: sku.variants.map((skuVariant) => {
            return {
              key: skuVariant.name,
              productVariantId: nameIdMappingObj[skuVariant.name],
              value: skuVariant.value,
            };
          }),
        };
      },
    );
    return await this.skuService.create(normalizedCreateArray, transaction);
  }

  async update(
    body: UpdateProductRequest,
    { id }: Params,
    user: IUser,
    transaction: Transaction,
  ) {
    // validating if each sku variant name is one of the variants names
    this.productValidation.validateSentSkusVariants(
      body.variants,
      body.stockKeepUnits,
    );

    const product = await this.findOneById(id);

    const operator = await this.operatorDashboardService.findOneById(user.id);
    if (operator.id !== product.operatorId) {
      throw new HttpException('Forbidden Resource', HttpStatus.FORBIDDEN);
    }
    const { image, stockKeepUnits, variants, subcategory, ...remainingData } =
      body;

    // checking the existence of subcategory
    await this.categoryService.findSubcategory(body.subcategory);

    // calculating the total quantity of the product
    const totalQuantity = body.stockKeepUnits.reduce(
      (sum: number, sku: ProductSku) => {
        return sum + sku.quantity;
      },
      0,
    );

    // checking the existence of image
    await this.imageService.findOneById(image);

    await product.update(
      {
        ...remainingData,
        subcategoryId: subcategory,
        quantity: totalQuantity,
        imageId: image,
        operatorId: operator.id,
      },
      { transaction },
    );
    // deleting the old skus and variants
    await this.clearOldVariantsAndSkus(product.id, transaction);
    // creating the variants and attaching them to the product
    const variantsIds = await this.createVariants(
      variants,
      product.id,
      transaction,
    );
    await product.$set('variants', variantsIds, { transaction });

    const nameIdMappingObj: JObject = {};

    console.assert(variantsIds.length === variants.length);
    for (let i = 0; i < variants.length; i++) {
      nameIdMappingObj[variants[i].name.en] = variantsIds[i];
    }
    console.log({ variants, variantsIds });
    console.log({ nameIdMappingObj });

    // creating the skus related to product
    const skusIds = await this.createSku(
      stockKeepUnits,
      product.id,
      nameIdMappingObj,
      transaction,
    );
    if (skusIds.length) product.defaultSkuId = skusIds[0];
    console.log({ skusIds });
    await product.$set('skus', skusIds, { transaction });

    return product;
  }
}
