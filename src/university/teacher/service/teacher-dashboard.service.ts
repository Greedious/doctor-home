import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  SupervisedGroupRepository,
  TeacherRepository,
  TeacherSubjectRepository,
} from '../data/teacher.repository';
import {
  AssignSubjectRequest,
  CreateTeacherRequest,
  DeleteGroupTeacherRequest,
  UpdateTeacherRequest,
} from '../api/dto/request';
import { TeacherError } from './teacher-error.service';
import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import {
  SupervisedGroup,
  Teacher,
  TeacherSubject,
} from '../data/teacher.schema';

import { orderCriteria } from 'package/utils/methods';
import { SpecialtyService } from 'src/university/specialty/service/specialty.service';
import { Subject } from 'src/university/subject/data/subject.schema';
import { Params } from 'package/component/params/params';
import { Year } from 'src/university/year/data/year.schema';
import { Group } from 'src/university/group/data/group.schema';
import { Specialty } from 'src/university/specialty/data/specialty.schema';

@Injectable()
export class TeacherDashboardService {
  constructor(
    private teacherRepository: TeacherRepository,
    private teacherSubjectRepository: TeacherSubjectRepository,
    private supervisedGroupRepository: SupervisedGroupRepository,
    private specialtyService: SpecialtyService,
    private teacherError: TeacherError,
  ) {}
  async findFreeTeachers() {
    const freeTeachers = await this.teacherRepository.findAll({
      include: [
        {
          model: TeacherSubject,
          required: false,
          include: [{ model: SupervisedGroup, required: true }],
        },
      ],
      where: {
        $subjects$: { [Op.is]: null },
      },
    });
    return freeTeachers;
  }
  async checkSpecialty(id: number) {
    return await this.specialtyService.findOneById(id);
  }

  async findOne(id: number, fullInfo: boolean = true) {
    let include: Includeable[] = [];
    if (fullInfo) {
      include = [Specialty, { model: TeacherSubject, include: [Subject] }];
    }
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      error: this.teacherError.notFound(),
      include,
    });
    return teacher;
  }

  async findAll(
    filters: WhereOptions<Teacher>,
    pagination: { limit: number; skip: number },
  ) {
    const { limit, skip } = pagination;
    const teachers = await this.teacherRepository.findAndCount({
      where: filters,
      options: { limit, offset: skip, order: orderCriteria() },
    });
    return teachers;
  }

  async create(body: CreateTeacherRequest, transaction: Transaction) {
    const created = await this.teacherRepository.create({
      doc: body,
      options: { transaction },
    });

    return { id: created.id };
  }

  async update(
    body: UpdateTeacherRequest,
    id: number,
    transaction: Transaction,
  ) {
    const teacher = await this.findOne(id);
    await teacher.update(body, { transaction });

    return;
  }

  async delete(id: number) {
    const teacher = await this.findOne(id);
    await teacher.destroy();
    return;
  }

  async checkIfNotAssignedSubject(teacherId: number, subjectId: number) {
    const teacherSubject = await this.teacherSubjectRepository.findOne({
      where: { teacherId, subjectId },
    });

    if (teacherSubject) {
      throw new HttpException(
        this.teacherError.alreadyAssigned(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async checkIfAssigned(teacherId: number, subjectId: number) {
    return await this.teacherSubjectRepository.findOne({
      where: { teacherId, subjectId },
      error: this.teacherError.notAssigned(),
    });
  }

  //* Teacher Subject
  async findTeacherSubjects(teacherId: number) {
    const subjects = await this.teacherSubjectRepository.findAll({
      where: { teacherId },
      include: [
        Subject,
        {
          model: SupervisedGroup,
          include: [{ model: Group, include: [Year] }],
        },
      ],
    });
    return subjects;
  }

  async findOneTeacherSubject(teacherId: number, subjectId: number) {
    const teacherSubject = await this.teacherSubjectRepository.findOne({
      where: { teacherId, subjectId },
      error: this.teacherError.notFoundTeacherSubject(),
      include: [
        {
          model: SupervisedGroup,
          include: [{ model: Group, include: [Year] }],
        },
        Subject,
      ],
    });
    return teacherSubject;
  }

  async assignSubject(body: AssignSubjectRequest, teacherId: number) {
    return await this.teacherSubjectRepository.create({
      doc: {
        teacherId,
        subjectId: body.subjectId,
        supervisedGroups: body.groups.map((group) => {
          return { groupId: group } as SupervisedGroup;
        }),
      },
      options: {
        include: [SupervisedGroup],
      },
    });
  }
  async deleteSubject(teacherId: number, subjectId: number) {
    const teacherSubject = await this.teacherSubjectRepository.delete({
      where: {
        subjectId,
        teacherId,
      },
    });

    if (!teacherSubject) {
      throw new HttpException(
        this.teacherError.notAssigned(),
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async deleteSubjectGroup(teacherSubjectId: number, groupId: number) {
    const teacherSubject = await this.supervisedGroupRepository.delete({
      where: {
        groupId,
        teacherSubjectId,
      },
    });

    if (!teacherSubject) {
      throw new HttpException(
        this.teacherError.notAssignedGroup(),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createSubjectGroup(teacherSubjectId: number, groupId: number) {
    return await this.supervisedGroupRepository.create({
      doc: {
        groupId,
        teacherSubjectId,
      },
    });

    return;
  }
}
