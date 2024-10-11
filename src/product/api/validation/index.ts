import {
  HttpException,
  HttpStatus,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateProductRequest,
  GetAllProductMobileQuery,
  ProductVariant,
  UpdateProductRequest,
  ProductSku,
  CheckProducts,
  GetByIdProductQuery,
  UpdateFavoriteProduct,
} from '../dto/request';
import * as joi from 'joi';
import { validationSchema } from 'package/validation';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { Params } from 'package/component/params/params';
import { pagination } from 'package/pagination/validation';
import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';
import { VariantType } from 'src/variant/data/variant.schema';
import { createVariantSchema } from 'src/variant/api/validation';
import { createSkuSchema } from 'src/sku/api/validation';

const variantSchema = joi
  .object({
    name: validationSchema.language().required(),
    type: joi
      .string()
      .valid(...Object.values(VariantType))
      .required(),
    values: joi.array().items(joi.string().required()).required(),
  })
  .required();

const skuVariantSchema = joi.object<{
  name: string;
  value: string;
}>({
  name: joi.string().required(),
  value: joi.string().required(),
});

const skuSchema = joi.object<ProductSku>({
  image: validationSchema.id(),
  price: joi.number().integer().min(0).required(),
  quantity: joi.number().integer().min(0).required(),
  variants: joi.array().items(skuVariantSchema).required(),
});

@Injectable()
export class ProductValidation {
  validateSentSkusVariants(variants: ProductVariant[], skus: ProductSku[]) {
    const englishNames = variants.map(
      (variant: ProductVariant) => variant.name.en,
    );
    let result: boolean = true;
    for (const sku of skus) {
      result &&= sku.variants.some((variant) =>
        englishNames.includes(variant.name),
      );
    }
    if (!result)
      throw new HttpException(
        'Each sku variant name should be present in variants english names',
        HttpStatus.BAD_REQUEST,
      );
    return;
  }
  create({ body }: { body: CreateProductRequest }) {
    const create = joi
      .object<CreateProductRequest>({
        name: validationSchema.language().required(),
        description: validationSchema.language().required(),
        image: validationSchema.id().required(),
        price: joi.number().integer().min(0).required(),
        subcategory: validationSchema.id().required(),
        variants: joi
          .array()
          .items(variantSchema)
          .unique((a, b) => a.name.ar === b.name.ar || a.name.en === b.name.en)
          .required(),
        stockKeepUnits: joi.array().items(skuSchema).required(),
      })
      .required();
    return new JoiValidationPipe(create).transform(body);
  }

  update({ body }: { body: UpdateProductRequest }) {
    const update = joi
      .object<UpdateProductRequest>({
        name: validationSchema.language().optional(),
        description: validationSchema.language().optional(),
        image: validationSchema.id().required().optional(),
        price: joi.number().integer().min(0).required().optional(),
        subcategory: validationSchema.id().optional(),
        variants: joi
          .array()
          .items(variantSchema)
          .unique((a, b) => a.name.ar === b.name.ar || a.name.en === b.name.en),
        stockKeepUnits: joi.array().items(skuSchema),
      })
      .required()
      .options({ allowUnknown: true });
    return new JoiValidationPipe(update).transform(body);
  }

  paramsId({ params }: { params: Params }) {
    const paramsId = joi
      .object({ id: validationSchema.id().required() })
      .options({ allowUnknown: true })
      .required();
    return new JoiValidationPipe(paramsId).transform(params);
  }

  getAll({ query }: { query: GetByCriteria }) {
    const getAll = joi.object({
      ...pagination([true]),
    });
    return new JoiValidationPipe(getAll).transform(query);
  }
  getByIdMobile({ query }: { query: GetByIdProductQuery }) {
    const getById = joi.object<GetByIdProductQuery>({
      isFavorite: joi.boolean().default(false),
    });
    return new JoiValidationPipe(getById).transform(query);
  }
  getAllMobile({ query }: { query: GetAllProductMobileQuery }) {
    const getAll = joi.object<GetAllProductMobileQuery>({
      ...pagination([true]),
      search: joi.string(),
      categoryId: validationSchema.id(),
      subcategoryId: validationSchema.id(),
      isFavorite: joi.boolean(),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
  checkProduct({ body }: { body: CheckProducts }) {
    const check = joi.object({
      products: joi
        .array()
        .items(
          joi.object({
            id: validationSchema.id().required(),
            price: joi.number().min(1).required(),
            quantity: joi.number().min(1).required(),
          }),
        )
        .required()
        .unique((a, b) => a.id === b.id),
    });

    return new JoiValidationPipe(check).transform(body);
  }
}
