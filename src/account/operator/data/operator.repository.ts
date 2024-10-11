import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Operator } from './operator.schema';

@Injectable()
export class OperatorRepository extends SequelizeRepository<Operator> {
  constructor(
    @InjectModel(Operator)
    operatorRepository: typeof Operator,
  ) {
    super(operatorRepository);
  }
}
