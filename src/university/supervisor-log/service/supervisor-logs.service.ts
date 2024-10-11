import { Injectable } from '@nestjs/common';
import { SupervisorLogRepository } from '../data/supervisor-logs.repository';

import { SupervisorLogError } from './supervisor-logs-error.service';

@Injectable()
export class SupervisorLogService {
  constructor(
    private supervisorLogRepository: SupervisorLogRepository,
    private supervisorLogError: SupervisorLogError,
  ) {}

  async findOneById(id: number) {
    const supervisorLog = await this.supervisorLogRepository.findOne({
      where: { id },
      error: this.supervisorLogError.notFound(),
    });
    return supervisorLog;
  }
}
