import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { YearRepository } from '../data/year.repository';
import { CreateYearRequest, UpdateYearRequest } from '../api/dto/request';
import { YearError } from './year-error.service';
import { Transaction, WhereOptions } from 'sequelize';
import { Year } from '../data/year.schema';
import { orderCriteria } from 'package/utils/methods';
import { Group } from 'src/university/group/data/group.schema';

@Injectable()
export class YearDashboardService {
  constructor(
    private yearRepository: YearRepository,
    private yearError: YearError,
  ) {}

  async findOne(id: number) {
    const year = await this.yearRepository.findOne({
      where: { id },
      include: [Group],
      error: this.yearError.notFound(),
    });
    return year;
  }
  async checkSameYearRank(rank: number, currentYearId?: number) {
    const year = await this.yearRepository.findOne({ where: { rank } });
    if (year && year.id !== currentYearId)
      throw new HttpException(
        this.yearError.sameYearRank(),
        HttpStatus.BAD_REQUEST,
      );
    return;
  }
  async findAll(filters: WhereOptions<Year>) {
    const years = await this.yearRepository.findAll({
      where: filters,
      order: orderCriteria(),
      include: [Group],
    });
    return years;
  }

  async create(body: CreateYearRequest, transaction: Transaction) {
    const { groupsIds, ...remData } = body;

    await this.checkSameYearRank(body.rank);

    const createdYear = await this.yearRepository.create({
      doc: remData,
      options: { transaction },
    });
    await createdYear.$set('groups', groupsIds, { transaction });

    return { id: createdYear.id };
  }

  async update(body: UpdateYearRequest, id: number, transaction: Transaction) {
    const { groupsIds, ...remData } = body;

    if (body.rank) await this.checkSameYearRank(body.rank, id);

    const year = await this.findOne(id);
    await year.update({ ...remData }, { transaction });
    await year.$set('groups', groupsIds, { transaction });

    return;
  }

  async delete(id: number) {
    const year = await this.findOne(id);
    await year.destroy();
    return;
  }
}
