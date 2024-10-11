import { Injectable } from '@nestjs/common';
import { SpecialtyRepository } from '../data/specialty.repository';
import {
  CreateSpecialtyRequest,
  UpdateSpecialtyRequest,
} from '../api/dto/request';
import { SpecialtyError } from './specialty-error.service';
import { WhereOptions } from 'sequelize';
import { Specialty } from '../data/specialty.schema';
import path from 'path';
import { orderCriteria } from 'package/utils/methods';
import { Params } from 'package/component/params/params';

@Injectable()
export class SpecialtyService {
  constructor(
    private specialtyRepository: SpecialtyRepository,
    private specialtyError: SpecialtyError,
  ) {}

  async findOneById(id: number) {
    const specialty = await this.specialtyRepository.findOne({
      where: { id },
      error: this.specialtyError.notFound(),
    });
    return specialty;
  }
}
