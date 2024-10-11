import { Injectable } from '@nestjs/common';
import { AdsRepository } from '../data/ads.repository';
import { AdsError } from './ads-error.service';

@Injectable()
export class AdsService {
  constructor(
    private adsRepository: AdsRepository,
    private adsError: AdsError,
  ) {}
}
