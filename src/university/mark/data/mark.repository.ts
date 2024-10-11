import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Mark } from './mark.schema';

@Injectable()
export class MarkRepository extends SequelizeRepository<Mark> {
  constructor(
    @InjectModel(Mark)
    markRepository: typeof Mark,
  ) {
    super(markRepository);
  }
}
