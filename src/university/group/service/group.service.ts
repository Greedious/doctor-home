import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GroupRepository } from '../data/group.repository';
import { CreateGroupRequest, UpdateGroupRequest } from '../api/dto/request';
import { GroupError } from './group-error.service';
import { Transaction, WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { Chair, ChairStudent } from 'src/university/chair/data/chair.schema';
import { Subject } from 'src/university/subject/data/subject.schema';
import { GroupSchedule } from '../data/group.schema';
import { StudentRepository } from 'src/university/student/data/student.repository';
import { StudentError } from 'src/university/student/service/student-error.service';
import { IUser } from 'src/shared/types/user';
import { Params } from 'package/component/params/params';

@Injectable()
export class GroupService {
  constructor(
    private groupRepository: GroupRepository,
    private studentRepository: StudentRepository,
    private studentError: StudentError,
    private groupError: GroupError,
  ) {}

  async findStudentScheduleBySubjectId(
    user: IUser,
    { id }: Params,
    groupScheduleFilter: WhereOptions<GroupSchedule>,
  ) {
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
                    ...groupScheduleFilter,
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

  async checkGroup(groupId: number, yearId?: number) {
    return await this.groupRepository.findOne({
      where: { id: groupId, yearId },
      error: this.groupError.notFound(),
    });
  }

  async checkGroups(groupIds: number[], yearId: number) {
    const groups = await this.groupRepository.findAll({
      where: { id: { [Op.in]: groupIds }, yearId },
    });

    if (groupIds.length !== groups.length) {
      throw new HttpException(
        this.groupError.notFound(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return groups;
  }

  async groupsInYear(yearId: number) {
    const groups = await this.groupRepository.findAll({ where: { yearId } });
    return groups;
  }

  async findById(id: number, throwError: boolean = false) {
    const group = await this.groupRepository.findOne({
      where: { id },
      error: throwError ? this.groupError.notFound() : undefined,
    });
    return group;
  }

  async createIfNotExist(
    groups: CreateGroupRequest[] | UpdateGroupRequest[],
    yearId: number,
    transaction: Transaction,
  ) {
    const groupsIds: number[] = [];
    for (const group of groups) {
      const foundGroup = await this.groupRepository.findOne({
        where: { name: group.name, yearId },
      });
      if (!foundGroup) {
        // create group with this name
        const createdGroup = await this.groupRepository.create({
          doc: { name: group.name, yearId },
          options: { transaction },
        });
        groupsIds.push(createdGroup.id);
      } else groupsIds.push(foundGroup.id);
    }
    return groupsIds;
  }

  async create(body: CreateGroupRequest, yearId: number) {
    const group = await this.groupRepository.create({
      doc: {
        ...body,
        yearId,
      },
    });
    return { id: group.id };
  }

  async update(body: UpdateGroupRequest, id: number) {
    const group = await this.findById(id, true);
    await group.update({ ...body });
    return { id };
  }

  async delete(id: number) {
    const group = await this.findById(id, true);
    await group.destroy();
    return;
  }
}
