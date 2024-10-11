import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ChairRepository,
  ChairStudentRepository,
} from '../data/chair.repository';
import { CreateChairRequest, UpdateChairRequest } from '../api/dto/request';
import { ChairError } from './chair-error.service';
import { Transaction, WhereOptions } from 'sequelize';
import { Chair } from '../data/chair.schema';
import { orderCriteria } from 'package/utils/methods';
import { Subject } from 'src/university/subject/data/subject.schema';
import { Student } from 'src/university/student/data/student.schema';
import { Op } from 'sequelize';

@Injectable()
export class ChairDashboardService {
  constructor(
    private chairRepository: ChairRepository,
    private chairError: ChairError,
    private chairStudentRepository: ChairStudentRepository,
  ) {}

  async findOne(id: number) {
    const chair = await this.chairRepository.findOne({
      where: { id },
      include: [Subject],
      error: this.chairError.notFound(),
    });
    return chair;
  }

  async findAll(filters: WhereOptions<Chair>) {
    const chairs = await this.chairRepository.findAndCount({
      where: filters,
      order: orderCriteria(),
      include: [Subject],
    });
    return chairs;
  }

  async checkEnoughChairCapacityForStudent(students: Student[], chair: Chair) {
    const groupId = students[0].groupId;
    const studentsIds: number[] = students.map((student) => student.id);
    // checking if there is enough capacity for the student on the chair
    const currentStudents = await this.chairStudentRepository.findAndCount({
      where: { chairId: chair.id },
      include: [{ model: Student, where: { groupId: groupId } }],
    });
    const existingStudents = await this.chairStudentRepository.findAndCount({
      where: { chairId: chair.id, studentId: { [Op.in]: studentsIds } },
      include: [{ model: Student, where: { groupId: groupId } }],
    });

    if (currentStudents.count - existingStudents.count >= chair.capacity) {
      throw new HttpException(
        this.chairError.capacityLimitExceeded(),
        HttpStatus.CONFLICT,
      );
    }
    return;
  }

  async linkStudentToChair(
    student: Student,
    chair: Chair,
    subject: Subject,
    transaction: Transaction,
  ) {
    const oldChairStudent = await this.chairStudentRepository.findOne({
      where: {
        studentId: student.id,
        subjectId: subject.id,
      },
      include: [{ model: Chair }],
      throwError: false,
    });
    // remove the student from this chair
    if (oldChairStudent) await oldChairStudent.destroy({ transaction });

    // create new student-chair link
    await this.chairStudentRepository.create({
      doc: { studentId: student.id, chairId: chair.id, subjectId: subject.id },
      options: { transaction },
    });

    return;
  }

  async create(body: CreateChairRequest, transaction: Transaction) {
    const createdChair = await this.chairRepository.create({
      doc: body,
      options: { transaction },
    });

    if (body.subjectIds) {
      await createdChair.$set('subjects', body.subjectIds, { transaction });
    }
    return { id: createdChair.id };
  }

  async update(body: UpdateChairRequest, id: number, transaction: Transaction) {
    const chair = await this.findOne(id);
    const { subjectIds, ...update } = body;
    await chair.update(update, { transaction });
    if (subjectIds.length) {
      await chair.$set('subjects', subjectIds, { transaction });
    }

    return;
  }

  async delete(id: number) {
    const chair = await this.findOne(id);
    await chair.destroy();
    return;
  }
}
