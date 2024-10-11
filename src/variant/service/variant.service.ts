import { Injectable } from '@nestjs/common';
import { VariantRepository } from '../data/variant.repository';
import { CreateVariant, GetVariantsQuery } from '../api/dto/request';
import { GetByCriteria } from 'package/pagination/dto';
import { getLimitAndOffset, orderCriteria } from 'package/utils/methods';
import { FilterService } from 'package/helpers/filtering-service';
import { GetVariantEntity } from '../api/dto/response/get-variant';
import { Transaction, WhereOptions } from 'sequelize';
import { ProductVariant } from 'src/product/api/dto/request';
import { Op } from 'sequelize';
import { Variant } from '../data/variant.schema';

@Injectable()
export class VariantService {
  constructor(private readonly variantRepository: VariantRepository) {}
  private helperMethods = {
    filterFindVariants(query: GetVariantsQuery) {
      const { productId } = query;
      const filters = new FilterService();
      if (productId) filters.equals('productId', productId);
      return filters.get();
    },
  };

  async checkVariant(key: string, value: string, productId: number) {
    await this.variantRepository.create({ doc: { productId } });
  }

  async create(body: CreateVariant[], transaction: Transaction) {
    const ids: number[] = [];
    for (const variant of body) {
      const created = await this.variantRepository.create({
        doc: {
          type: variant.type,
          name: variant.name,
          key: variant.name.en,
          values: variant.values,
          productId: variant.productId,
        },
        options: { transaction },
      });
      ids.push(created.id);
    }
    return ids;
  }

  async createIfNotExistsVariants(variants: CreateVariant[]) {
    const ids: number[] = [];
    for (const variant of variants) {
      const foundVariant = await this.variantRepository.findOne({
        where: {
          [Op.or]: [
            { 'name.en': variant.name.en },
            { 'name.ar': variant.name.ar },
          ],
        },
        throwError: false,
      });
      if (!foundVariant) {
        // create new one
        const created = await this.variantRepository.create({
          doc: {
            type: variant.type,
            name: variant.name,
            key: variant.name.en,
            values: variant.values,
            productId: variant.productId,
          },
        });
        ids.push(created.id);
      } else {
        // just add the id
        ids.push(foundVariant.id);
      }
    }
    return ids;
  }

  async findAll(query: GetVariantsQuery, transaction?: Transaction) {
    const variants = await this.variantRepository.findAll({
      where: this.helperMethods.filterFindVariants(query),
      order: orderCriteria(query),
      options: { transaction },
    });
    return variants.map((variant) =>
      new GetVariantEntity({ variant, lang: 'en' }).toObject(),
    );
  }

  async deleteWhere(
    deleteWhere: WhereOptions<Variant>,
    transaction?: Transaction,
  ) {
    await this.variantRepository.destroy({
      where: deleteWhere,
      options: { transaction },
    });
    return;
  }
}
