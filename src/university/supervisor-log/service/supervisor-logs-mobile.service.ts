import { Injectable } from '@nestjs/common';
import { SupervisorLogRepository } from '../data/supervisor-logs.repository';
import { GetByCriteria } from 'package/pagination/dto';
import { WhereOptions } from 'sequelize';
import { SupervisorLog } from '../data/supervisor-logs.schema';
import { Student } from 'src/university/student/data/student.schema';
import { Teacher } from 'src/university/teacher/data/teacher.schema';

@Injectable()
export class SupervisorLogMobileService {
  constructor(
    private readonly supervisorLogRepository: SupervisorLogRepository,
  ) {}

  async findAll(
    { skip, limit }: GetByCriteria,
    where: WhereOptions<SupervisorLog>,
  ) {
    const supervisorLogs = await this.supervisorLogRepository.findAndCount({
      where,
      options: { offset: skip, limit },
      include: [Student, Teacher],
    });
    return supervisorLogs;
  }
}
