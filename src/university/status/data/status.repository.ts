import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Status } from './status.schema';

@Injectable()
export class StatusRepository extends SequelizeRepository<Status> {
  constructor(
    @InjectModel(Status)
    statusRepository: typeof Status,
  ) {
    super(statusRepository);
  }
}
