import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Year } from './year.schema';

@Injectable()
export class YearRepository extends SequelizeRepository<Year> {
  constructor(
    @InjectModel(Year)
    yearRepository: typeof Year,
  ) {
    super(yearRepository);
  }
}
