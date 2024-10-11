import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../data/student.repository';
import { WhereOptions } from 'sequelize';
import { Student } from '../data/student.schema';
import { orderCriteria } from 'package/utils/methods';
import { Group } from 'src/university/group/data/group.schema';
import { User } from 'src/account/user/data/user.schema';
import { Year } from 'src/university/year/data/year.schema';
import { Doctor } from 'src/account/doctor/data/doctor.schema';
import { Subject } from 'src/university/subject/data/subject.schema';

@Injectable()
export class StudentMobileService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async findAll(
    filters: WhereOptions<Student>,
    pagination: { limit: number; skip: number },
    subjectId: number,
  ) {
    const { limit, skip } = pagination;
    const students = await this.studentRepository.findAndCount({
      where: filters,
      include: [
        {
          model: Year,
          include: [
            { model: Subject, where: { id: subjectId }, required: true },
          ],
          required: true,
        },
        Group,
        { model: Doctor, include: [User] },
      ],
      options: { limit, offset: skip, order: orderCriteria() },
    });
    return students;
  }
}
