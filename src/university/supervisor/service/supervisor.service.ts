import { Injectable } from '@nestjs/common';
import { SupervisorRepository } from '../data/supervisor.repository';
import { SupervisorError } from './supervisor-error.service';

@Injectable()
export class SupervisorService {
  constructor(
    private readonly supervisorRepository: SupervisorRepository,
    private readonly supervisorError: SupervisorError,
  ) {}

  async isThereSpecialty(specialtyId: number) {
    return await this.supervisorRepository.findOne({ where: { specialtyId } });
  }

  async findOneById(id: number) {
    const supervisor = await this.supervisorRepository.findOne({
      where: { id },
      error: this.supervisorError.notFound(),
    });
    return supervisor;
  }
}
