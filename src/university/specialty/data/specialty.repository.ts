import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Specialty } from './specialty.schema';

@Injectable()
export class SpecialtyRepository extends SequelizeRepository<Specialty> {
  constructor(
    @InjectModel(Specialty)
    specialtyRepository: typeof Specialty,
  ) {
    super(specialtyRepository);
  }
}
