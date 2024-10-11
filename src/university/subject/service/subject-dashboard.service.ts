import { Injectable } from '@nestjs/common';
import { CreateSubjectRequest, UpdateSubjectRequest } from '../api/dto/request';
import { Params } from 'package/component/params/params';
import { SubjectError } from './subject-error.service';
import { Subject } from 'src/university/subject/data/subject.schema';
import { SubjectRepository } from '../data/subject.repository';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';

import { Year } from 'src/university/year/data/year.schema';
import { Teacher } from 'src/university/teacher/data/teacher.schema';

@Injectable()
export class SubjectDashboardService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly subjectError: SubjectError,
  ) {}

  async findOneById(id: number) {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      error: this.subjectError.notFound(),
      include: [Year],
    });
    return subject;
  }

  async findAll(
    filter: WhereOptions<Subject>,
    { limit, skip }: { limit: number; skip: number },
  ) {
    const subjects = await this.subjectRepository.findAndCount({
      where: filter,
      options: { limit, offset: skip },
      include: [Year],
    });
    return subjects;
  }

  async delete({ id }: Params) {
    const subject = await this.findOneById(id);
    await subject.destroy();
    return;
  }

  async create(body: CreateSubjectRequest) {
    const subject = await this.subjectRepository.create({
      doc: body,
    });
    return { id: subject.id };
  }

  async update(body: UpdateSubjectRequest, { id }: Params) {
    const subject = await this.findOneById(id);
    await subject.update(body);

    return;
  }
}
