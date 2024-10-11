import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { UniversityOperator } from './operator.schema';

@Injectable()
export class UniversityOperatorRepository extends SequelizeRepository<UniversityOperator> {
  constructor(
    @InjectModel(UniversityOperator)
    universityOperatorRepository: typeof UniversityOperator,
  ) {
    super(universityOperatorRepository);
  }
}
