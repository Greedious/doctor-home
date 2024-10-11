import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  GroupRepository,
  GroupScheduleRepository,
} from '../data/group.repository';
import { CreateGroupRequest, UpdateGroupRequest } from '../api/dto/request';
import { GroupError } from './group-error.service';
import { Transaction, WhereOptions } from 'sequelize';
import { Group } from '../data/group.schema';
import { Year } from 'src/university/year/data/year.schema';
import { Params } from 'package/component/params/params';
import {
  CreateGroupScheduleRequest,
  UpdateGroupScheduleRequest,
} from '../api/dto/response';
import { Subject } from 'src/university/subject/data/subject.schema';

@Injectable()
export class GroupDashboardService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupScheduleRepository: GroupScheduleRepository,
    private readonly groupError: GroupError,
  ) {}

  async findById(id: number, throwError: boolean = true) {
    const group = await this.groupRepository.findOne({
      where: { id },
      error: throwError ? this.groupError.notFound() : undefined,
    });
    return group;
  }

  async findAll(
    filter: WhereOptions<Group>,
    { limit, skip }: { limit: number; skip: number },
  ) {
    const groups = await this.groupRepository.findAndCount({
      where: filter,
      options: { limit, offset: skip },
      include: [Year],
    });
    return groups;
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
    return;
  }

  async delete(id: number) {
    const group = await this.findById(id, true);
    await group.destroy();
    return;
  }

  async findOne(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
      error: this.groupError.notFound(),
      include: [Year],
    });
    return group;
  }

  //* Group Schedule

  async checkIfAssignedSchedule(groupId: number, subjectId: number) {
    const groupSchedule = await this.groupScheduleRepository.findOne({
      where: {
        groupId,
        subjectId,
      },
    });

    if (groupSchedule) {
      throw new HttpException(
        this.groupError.alreadyAssignedGroup(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async isAvailableTime(groupId: number, body: CreateGroupScheduleRequest) {
    await this.groupScheduleRepository.isAvailableTime({
      groupId,
      dayOfWeek: body.dayOfWeek,
      startTime: body.startTime,
      endTime: body.endTime,
    });
  }

  async deleteSchedule(groupId: number, subjectId: number) {
    const groupSchedule = await this.groupScheduleRepository.delete({
      where: {
        groupId,
        subjectId,
      },
    });

    if (!groupSchedule) {
      throw new HttpException(
        this.groupError.notFound(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createSchedule({ id }: Params, body: CreateGroupScheduleRequest) {
    return await this.groupScheduleRepository.create({
      doc: {
        ...body,
        groupId: +id,
      },
    });
  }

  async updateSchedule({ id }: Params, body: UpdateGroupScheduleRequest) {
    const update = await this.groupScheduleRepository.update({
      where: {
        groupId: +id,
        subjectId: body.subjectId,
      },
      update: body,
    });
    if (!update[0]) {
      throw new HttpException(this.groupError.notFound(), HttpStatus.NOT_FOUND);
    }
  }

  async findGroupSchedules(id: number) {
    const groupSchedules = await this.groupScheduleRepository.findAll({
      where: { groupId: id },
      include: [Subject, Group],
    });
    return groupSchedules;
  }

  async findOneGroupSchedule(groupId: number, subjectId: number) {
    const groupSchedule = await this.groupScheduleRepository.findOne({
      where: { groupId, subjectId },
      error: this.groupError.notFound(),
      include: [Subject, Group],
    });
    return groupSchedule;
  }

  checkSameYearSubject(groupYear: number, subjectYear: number) {
    if (groupYear !== subjectYear) {
      throw new HttpException(
        this.groupError.notSameYearWithSubject(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
