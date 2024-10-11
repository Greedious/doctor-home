import { Injectable } from '@nestjs/common';
import { PrivilegeRepository } from '../data/privilege.repository';
import { GetByCriteria } from 'package/pagination/dto';
import { WhereOptions } from 'sequelize';
import { Privilege } from '../data/privilege.schema';
import { Op } from 'sequelize';
import { PrivilegeTypeEnum } from '../api/dto/request';

@Injectable()
export class PrivilegeDashboardService {
  constructor(private privilegeRepository: PrivilegeRepository) {}

  async findAll({
    limit,
    skip,
    needPagination,
    type,
  }: {
    needPagination: boolean;
    limit: number;
    skip: number;
    type?: PrivilegeTypeEnum;
  }) {
    let offset = undefined,
      take = undefined;
    if (needPagination) {
      offset = skip;
      take = limit;
    }

    let whereOptions: WhereOptions<Privilege> = {};
    if (type) {
      if (type === PrivilegeTypeEnum.E_COMMERCE) {
        whereOptions = {
          [Op.not]: {
            key: {
              [Op.substring]: 'university',
            },
          },
        };
      } else if (type === PrivilegeTypeEnum.UNIVERSITY) {
        whereOptions = {
          key: {
            [Op.substring]: 'university',
          },
        };
      }
    }
    const privileges = await this.privilegeRepository.findAndCount({
      where: whereOptions,
      options: { offset, limit: take },
    });
    return privileges;
  }
}
