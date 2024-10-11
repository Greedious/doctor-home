import { Injectable } from '@nestjs/common';
import { Params } from 'package/component/params/params';
import { AdsError } from './ads-error.service';
import { AdsRepository } from '../data/ads.repository';

@Injectable()
export class AdsMobileService {
  constructor(
    private adsRepository: AdsRepository,
    private adsError: AdsError,
  ) {}

  async findOneById(id: number) {
    const ads = await this.adsRepository.findOne({
      where: { id },
      error: this.adsError.notFound(),
    });
    return ads;
  }

  async findOne({ id }: Params) {
    const ads = await this.findOneById(id);
    return ads;
  }

  async findAll() {
    const ads = await this.adsRepository.findAll({});

    return ads;
  }
}
