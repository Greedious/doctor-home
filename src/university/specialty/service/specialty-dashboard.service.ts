import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { TeacherRepository } from 'src/university/teacher/data/teacher.repository';
import { TeacherError } from 'src/university/teacher/service/teacher-error.service';

@Injectable()
export class SpecialtyDashboardService {
  constructor(
    private specialtyRepository: SpecialtyRepository,
    private teacherRepository: TeacherRepository,
    private specialtyError: SpecialtyError,
  ) {}

  async canDelete(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { specialtyId: id },
    });

    if (teacher) {
      throw new HttpException(
        this.specialtyError.specialtyCannotDelete(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne({ id }: Params) {
    const specialty = await this.specialtyRepository.findOne({
      where: { id },
      error: this.specialtyError.notFound(),
    });
    return specialty;
  }
  async findOneById(id: number) {
    const specialty = await this.specialtyRepository.findOne({
      where: { id },
      error: this.specialtyError.notFound(),
    });
    return specialty;
  }

  async findAll(
    filters: WhereOptions<Specialty>,
    pagination: { limit: number; skip: number },
  ) {
    const { limit, skip } = pagination;
    const specialties = await this.specialtyRepository.findAndCount({
      where: filters,
      options: { limit, offset: skip, order: orderCriteria() },
    });
    return specialties;
  }

  async create(body: CreateSpecialtyRequest) {
    const created = await this.specialtyRepository.create({
      doc: body,
    });
    return { id: created.id };
  }

  async update(body: UpdateSpecialtyRequest, id: number) {
    const specialty = await this.findOneById(id);
    await specialty.update({
      ...body,
    });
    return;
  }

  async delete(id: number) {
    const specialty = await this.findOneById(id);
    await specialty.destroy();
    return;
  }
}
