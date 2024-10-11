import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { SupervisorLog } from './supervisor-logs.schema';

@Injectable()
export class SupervisorLogRepository extends SequelizeRepository<SupervisorLog> {
  constructor(
    @InjectModel(SupervisorLog)
    specialtyRepository: typeof SupervisorLog,
  ) {
    super(specialtyRepository);
  }
}
