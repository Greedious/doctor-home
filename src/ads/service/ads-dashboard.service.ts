import { Injectable } from '@nestjs/common';
import {
  CreateAdsRequest,
  UpdateAds,
  UpdateAdsRequest,
} from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { AdsError } from './ads-error.service';
import { AdsRepository } from '../data/ads.repository';
import { Image } from 'src/image/data/image.schema';

@Injectable()
export class AdsDashboardService {
  constructor(
    private adsRepository: AdsRepository,
    private adsError: AdsError,
  ) {}

  async findOneById(id: number) {
    const ads = await this.adsRepository.findOne({
      where: { id },
      include: [Image],
      error: this.adsError.notFound(),
    });
    return ads;
  }

  async findOne({ id }: Params) {
    const ads = await this.findOneById(id);
    return ads;
  }

  async findLastRank() {
    const ads = await this.adsRepository.findOne({});
    let rank = 1;
    if (ads) rank = ads.rank + 1;

    return rank;
  }

  async findAll() {
    const ads = await this.adsRepository.findAll({ include: [Image] });
    return ads;
  }

  async delete({ id }: Params) {
    await this.adsRepository.delete({
      where: { id },
    });
    return;
  }

  async create(body: CreateAdsRequest) {
    const rank = await this.findLastRank();

    const ads = await this.adsRepository.create({
      doc: {
        imageId: body.image,
        url: body.url,
        rank,
        description: body.description,
      },
    });

    return {
      id: ads.id,
    };
  }

  async update(body: UpdateAds, params: Params) {
    await this.adsRepository.update({
      where: { id: params.id },
      update: body,
    });
  }
}
