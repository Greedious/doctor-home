import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  TeacherRepository,
  TeacherSubjectRepository,
} from '../data/teacher.repository';
import { TeacherError } from './teacher-error.service';
import {
  SupervisedGroup,
  Teacher,
  TeacherSubject,
} from '../data/teacher.schema';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly teacherSubjectRepository: TeacherSubjectRepository,
    private readonly teacherError: TeacherError,
  ) {}

  async isThereSpecialty(specialtyId: number) {
    return await this.teacherRepository.findOne({ where: { specialtyId } });
  }

  async countTeachers(whereOptions: WhereOptions<Teacher>) {
    const count = await this.teacherRepository.count({ where: whereOptions });
    return count;
  }

  async checkTeacherTeachingSubject(teacherId: number, subjectId: number) {
    const count = await this.teacherSubjectRepository.count({
      where: { teacherId, subjectId },
    });
    if (!count) {
      throw new HttpException(
        this.teacherError.teacherDoesNotTeachSubject(),
        HttpStatus.FORBIDDEN,
      );
    }
    return;
  }

  async getSubjects(teacherId: number) {
    return await this.teacherSubjectRepository.findAll({
      where: {
        teacherId,
      },
    });
  }

  async findOneById(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      error: this.teacherError.notFound(),
    });
    return teacher;
  }

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

  async checkNoFreeTeachers() {
    const freeTeachers = await this.findFreeTeachers();
    if (freeTeachers.length) {
      throw new HttpException(
        this.teacherError.teacherDoesNotTeachSubject(),
        HttpStatus.FORBIDDEN,
      );
    }
    return;
  }
}
