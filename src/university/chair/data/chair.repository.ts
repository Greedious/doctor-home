import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Chair, ChairStudent } from './chair.schema';

@Injectable()
export class ChairRepository extends SequelizeRepository<Chair> {
  constructor(
    @InjectModel(Chair)
    chairRepository: typeof Chair,
  ) {
    super(chairRepository);
  }
}

@Injectable()
export class ChairStudentRepository extends SequelizeRepository<ChairStudent> {
  constructor(
    @InjectModel(ChairStudent) chairStudentRepository: typeof ChairStudent,
  ) {
    super(chairStudentRepository);
  }
}
