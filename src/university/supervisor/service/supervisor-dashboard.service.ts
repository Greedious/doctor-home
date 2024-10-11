import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupervisorRepository } from '../data/supervisor.repository';
import {
  CreateSupervisorRequest,
  UpdateSupervisorRequest,
} from '../api/dto/request';
import { SupervisorError } from './supervisor-error.service';
import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import { Supervisor } from '../data/supervisor.schema';

import { orderCriteria } from 'package/utils/methods';
import { SpecialtyService } from 'src/university/specialty/service/specialty.service';
import { Subject } from 'src/university/subject/data/subject.schema';
import { Specialty } from 'src/university/specialty/data/specialty.schema';

@Injectable()
export class SupervisorDashboardService {
  constructor(
    private supervisorRepository: SupervisorRepository,
    private specialtyService: SpecialtyService,
    private supervisorError: SupervisorError,
  ) {}
  async findFreeSupervisors() {
    const freeSupervisors = await this.supervisorRepository.findAll({
      where: {
        subjectId: null,
      },
    });
    return freeSupervisors;
  }

  async checkSubjectNotTaught(subjectId: number) {
    const supervisor = await this.supervisorRepository.findOne({
      where: {
        subjectId,
      },
    });
    if (supervisor) {
      throw new HttpException(
        this.supervisorError.subjectOccupied(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkSpecialty(id: number) {
    return await this.specialtyService.findOneById(id);
  }

  async findOne(id: number, fullInfo: boolean = true) {
    let include: Includeable[] = [];
    if (fullInfo) {
      include = [Specialty, Subject];
    }
    const supervisor = await this.supervisorRepository.findOne({
      where: { id },
      error: this.supervisorError.notFound(),
      include,
    });
    return supervisor;
  }

  async findAll(
    filters: WhereOptions<Supervisor>,
    pagination: { limit: number; skip: number },
  ) {
    const { limit, skip } = pagination;
    const supervisors = await this.supervisorRepository.findAndCount({
      where: filters,
      options: { limit, offset: skip, order: orderCriteria() },
    });
    return supervisors;
  }

  async create(body: CreateSupervisorRequest, transaction: Transaction) {
    const created = await this.supervisorRepository.create({
      doc: body,
      options: { transaction },
    });

    return { id: created.id };
  }

  async update(
    body: UpdateSupervisorRequest,
    id: number,
    transaction: Transaction,
  ) {
    const supervisor = await this.findOne(id);
    await supervisor.update(body, { transaction });

    return;
  }

  async delete(id: number) {
    const supervisor = await this.findOne(id);
    await supervisor.destroy();
    return;
  }
}
