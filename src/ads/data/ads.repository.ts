import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Ads } from './ads.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdsRepository extends SequelizeRepository<Ads> {
  constructor(
    @InjectModel(Ads)
    adsRepository: typeof Ads,
  ) {
    super(adsRepository);
  }
}
