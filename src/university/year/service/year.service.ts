import { Injectable } from '@nestjs/common';
import { YearRepository } from '../data/year.repository';
import { YearError } from './year-error.service';

@Injectable()
export class YearService {
  constructor(
    private readonly yearRepository: YearRepository,
    private readonly yearError: YearError,
  ) {}

  async checkYear(id: number) {
    return await this.yearRepository.findOne({
      where: { id },
      error: this.yearError.notFound(),
    });
  }
}
