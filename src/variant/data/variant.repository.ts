import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Variant } from './variant.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class VariantRepository extends SequelizeRepository<Variant> {
  constructor(
    @InjectModel(Variant)
    variantRepository: typeof Variant,
  ) {
    super(variantRepository);
  }
}
