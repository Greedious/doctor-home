import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StatusRepository } from '../data/status.repository';
import {
  UpdateStatusRequest,
  universityStatus,
  validStatuses,
} from '../api/dto/request';
import { StatusError } from './status-error.service';
import { Status } from '../data/status.schema';

@Injectable()
export class StatusDashboardService {
  constructor(
    private statusRepository: StatusRepository,
    private statusError: StatusError,
  ) {}

  async find() {
    const statuses = await this.statusRepository.findOne({
      error: this.statusError.notFound(),
    });
    return statuses;
  }

  async update(status: Status, body: UpdateStatusRequest) {
    await status.update(body);
    return;
  }

  checkIfValid(status: Status, updatedStatus: universityStatus) {
    if ((validStatuses[status.status] as any[]).includes(updatedStatus)) {
      throw new HttpException(
        this.statusError.notValidStatus,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
