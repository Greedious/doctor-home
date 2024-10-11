import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../data/student.repository';
import { CreateStudentRequest, UpdateStudentRequest } from '../api/dto/request';
import { StudentError } from './student-error.service';
import { Transaction, WhereOptions } from 'sequelize';
import { Student } from '../data/student.schema';
import { orderCriteria } from 'package/utils/methods';
import { Group } from 'src/university/group/data/group.schema';
import { Year } from 'src/university/year/data/year.schema';
import { Doctor } from 'src/account/doctor/data/doctor.schema';
import { User } from 'src/account/user/data/user.schema';

@Injectable()
export class StudentDashboardService {
  constructor(
    private studentRepository: StudentRepository,
    private studentError: StudentError,
  ) {}

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
      include: [Year, Group],
      error: this.studentError.notFound(),
    });
    return student;
  }

  async findAll(
    filters: WhereOptions<Student>,
    pagination: { limit: number; skip: number },
  ) {
    const { limit, skip } = pagination;
    const students = await this.studentRepository.findAndCount({
      where: filters,
      include: [Year, Group, { model: Doctor, include: [User] }],
      options: { limit, offset: skip, order: orderCriteria() },
    });
    return students;
  }

  async create(body: CreateStudentRequest, transaction: Transaction) {
    const student = await this.studentRepository.create({
      doc: body,
      options: { transaction },
    });
    return student;
  }

  async update(
    body: UpdateStudentRequest,
    id: number,
    transaction: Transaction,
  ) {
    const { year, group, ...remData } = body;
    const student = await this.findOne(id);
    await student.update(
      {
        ...remData,
        groupId: group,
        yearId: year,
      },
      { transaction },
    );
    return { id };
  }

  async delete(id: number) {
    const student = await this.findOne(id);
    await student.destroy();
    return;
  }
}
