import { Injectable } from '@nestjs/common';

import { SubjectError } from './subject-error.service';
import { Subject } from 'src/university/subject/data/subject.schema';
import { SubjectRepository } from '../data/subject.repository';
import { Includeable, WhereOptions } from 'sequelize';
import { Params } from 'package/component/params/params';
import { GetAllSubjectMobileQuery } from '../api/dto/request';
import { Teacher } from 'src/university/teacher/data/teacher.schema';
import { IUser } from 'src/shared/types/user';
import { Year } from 'src/university/year/data/year.schema';

@Injectable()
export class SubjectMobileService {
  constructor(
    private subjectRepository: SubjectRepository,
    private subjectError: SubjectError,
  ) {}

  private helperMethods = {};

  async findOneById(id: number) {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      error: this.subjectError.notFound(),
    });
    return subject;
  }

  async findOne({ id }: Params) {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      error: this.subjectError.notFound(),
    });

    return subject;
  }

  async findAll(filter: WhereOptions<Subject>, user: IUser) {
    const include: Includeable[] = [];
    if (user.teacher) {
      include.push({
        model: Teacher,
        where: { id: user.teacher },
        required: true,
      });
    }

    const subjects = await this.subjectRepository.findAll({
      where: filter,
      include,
    });
    return subjects;
  }
}
