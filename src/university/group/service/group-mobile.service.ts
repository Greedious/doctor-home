import { Injectable } from '@nestjs/common';
import { IUser } from 'src/shared/types/user';
import { StudentService } from 'src/university/student/service/student.service';
import { GroupScheduleRepository } from '../data/group.repository';
import { StudentRepository } from 'src/university/student/data/student.repository';
import { GroupSchedule } from '../data/group.schema';
import { Subject } from 'src/university/subject/data/subject.schema';
import { Chair, ChairStudent } from 'src/university/chair/data/chair.schema';
import { StudentError } from 'src/university/student/service/student-error.service';
import { Params } from 'package/component/params/params';

@Injectable()
export class GroupMobileService {
  constructor(
    private readonly groupScheduleRepository: GroupScheduleRepository,
    private readonly studentRepository: StudentRepository,
    private readonly studentError: StudentError,
  ) {}

  async findStudentSchedule(user: IUser) {
    const studentId = user.student;

    const groupId = (
      await this.studentRepository.findOne({
        where: { id: studentId },
        error: this.studentError.notFound(),
      })
    ).groupId;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      include: [
        {
          attributes: ['id', 'subjectId', 'chairId'],
          model: ChairStudent,
          required: true,
          include: [
            {
              model: Subject,
              include: [
                {
                  model: GroupSchedule,
                  where: {
                    groupId,
                  },
                  required: true,
                },
              ],
            },
            Chair,
          ],
        },
      ],
      options: {
        attributes: ['id'],
        rejectOnEmpty: false,
      },
    });
    return student;
  }

  async findStudentScheduleBySubjectId(user: IUser, { id }: Params) {
    const studentId = user.student;

    const groupId = (
      await this.studentRepository.findOne({
        where: { id: studentId },
        error: this.studentError.notFound(),
      })
    ).groupId;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      include: [
        {
          attributes: ['id', 'subjectId', 'chairId'],
          model: ChairStudent,
          required: true,
          include: [
            {
              model: Subject,
              where: { id },
              include: [
                {
                  model: GroupSchedule,
                  where: {
                    groupId,
                  },
                  required: true,
                },
              ],
            },
            Chair,
          ],
        },
      ],
      options: {
        attributes: ['id'],
        rejectOnEmpty: false,
      },
    });
    return student;
  }
}
