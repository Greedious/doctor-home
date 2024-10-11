import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StudentRepository } from '../data/student.repository';
import { StudentError } from './student-error.service';
import { Group } from 'src/university/group/data/group.schema';
import { Year } from 'src/university/year/data/year.schema';
import { Subject } from 'src/university/subject/data/subject.schema';
import { Student } from '../data/student.schema';
import { Op, WhereOptions } from 'sequelize';
import { ChairStudent } from 'src/university/chair/data/chair.schema';
import { SubjectService } from 'src/university/subject/service/subject.service';
import { Teacher } from 'src/university/teacher/data/teacher.schema';

@Injectable()
export class StudentService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly studentError: StudentError,
    private readonly subjectService: SubjectService,
  ) {}

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
      include: [Year, Group],
      error: this.studentError.notFound(),
    });
    return student;
  }

  async countStudents(whereOptions: WhereOptions<Student>) {
    const count = await this.studentRepository.count({ where: whereOptions });
    return count;
  }
  async checkStudentsExistenceAndInSameGroup(ids: number[]) {
    const students = await this.studentRepository.findAndCount({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      include: [Year, Group],
    });
    if (students.rows.length !== ids.length) {
      throw new HttpException(
        this.studentError.notFound(),
        HttpStatus.NOT_FOUND,
      );
    }
    const allInSameGroup = students.rows.every(
      (student) => student.groupId === students.rows[0].groupId,
    );
    if (!allInSameGroup) {
      throw new HttpException(
        this.studentError.studentsNotInSameGroup(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return students;
  }

  async findOneWithGroup(id: number) {
    return await this.studentRepository.findOne({
      where: { id },
      include: [Group],
      error: this.studentError.notFound(),
    });
  }

  async checkSubjectInStudentYear(studentId: number, subjectId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      include: [{ model: Year, include: [Subject] }],
    });
    const hasTheSubjectInYear = student.year.subjects.some((subject) => {
      return subject.id === subjectId;
    });
    if (!hasTheSubjectInYear) {
      throw new HttpException(
        this.studentError.subjectNotInStudentYear(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return;
  }

  async checkIfAllHasGroup() {
    const student = await this.studentRepository.findOne({
      where: { groupId: null },
    });
    if (student) {
      throw new HttpException(
        this.studentError.studentNotAssignedToGroup(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkEveryStudentsHasChairs() {
    // checks if all students has chair on subjects on same year of student
    const students = await this.studentRepository.findAll({
      include: [{ model: ChairStudent, attributes: ['subjectId'] }],
    });

    for (const student of students) {
      //! make year required in student or check if each student is related to year
      if (!student.yearId) continue;

      const cnt = new Map<number, number>();

      const subjectsIds = student.chairs.map((chair) => chair.subjectId);

      const subjectsInSameStudentYear =
        await this.subjectService.subjectsInYear(student.yearId);

      for (const subject of subjectsInSameStudentYear) {
        cnt[subject.id]++;
      }

      for (const id of subjectsIds) {
        cnt[id]--;
      }

      for (const [key, value] of cnt) {
        if (value > 0) {
          throw new HttpException(
            this.studentError.studentHasNoChairOnSubject(),
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }
    return;
  }
}
