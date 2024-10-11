import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Subject } from './subject.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SubjectRepository extends SequelizeRepository<Subject> {
  constructor(
    @InjectModel(Subject)
    subjectRepository: typeof Subject,
  ) {
    super(subjectRepository);
  }
}
