import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Group, GroupSchedule } from './group.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GroupError } from '../service/group-error.service';

@Injectable()
export class GroupRepository extends SequelizeRepository<Group> {
  constructor(
    @InjectModel(Group)
    groupRepository: typeof Group,
  ) {
    super(groupRepository);
  }
}

@Injectable()
export class GroupScheduleRepository extends SequelizeRepository<GroupSchedule> {
  constructor(
    @InjectModel(GroupSchedule)
    groupScheduleRepository: typeof GroupSchedule,
    private groupScheduleError: GroupError,
  ) {
    super(groupScheduleRepository);
  }

  async isAvailableTime({
    groupId,
    dayOfWeek,
    startTime,
    endTime,
  }: {
    groupId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }) {
    const schedule = await this.findOne({
      where: {
        [Op.and]: [
          {
            groupId,
            dayOfWeek,
          },
        ],
        [Op.or]: [
          {
            startTime: {
              [Op.and]: [
                {
                  [Op.gte]: startTime,
                },
                {
                  [Op.lte]: endTime,
                },
              ],
            },
          },
          {
            endTime: {
              [Op.and]: [
                {
                  [Op.gte]: startTime,
                },
                {
                  [Op.lte]: endTime,
                },
              ],
            },
          },
          {
            startTime: { [Op.gte]: startTime },
            endTime: { [Op.lte]: endTime },
          },
        ],
      },
    });

    if (schedule) {
      throw new HttpException(
        this.groupScheduleError.groupIsNotAvailableInThisTime(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
