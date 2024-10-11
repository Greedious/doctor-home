import { Injectable } from '@nestjs/common';
import { StatusRepository } from '../data/status.repository';
import { StatusError } from './status-error.service';
import { universityStatus } from '../api/dto/request';

@Injectable()
export class StatusService {
  constructor(
    private readonly statusRepository: StatusRepository,
    private readonly statusError: StatusError,
  ) {}

  async seed() {
    await this.statusRepository.create({
      doc: { status: universityStatus.registrationPhase },
    });
  }
}
