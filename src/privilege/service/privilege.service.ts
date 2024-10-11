import { Injectable } from '@nestjs/common';
import {
  privilegeKeys,
  universityPrivilegeKeys,
} from '../data/privilege.schema';
import { privilegesData } from 'src/db/seed/privileges.data';
import { PrivilegeRepository } from '../data/privilege.repository';
import { Op } from 'sequelize';
import { adminPrivileges } from 'src/db/seed/role.data';

@Injectable()
export class PrivilegeService {
  constructor(private readonly privilegeRepository: PrivilegeRepository) {}

  async seed() {
    for (const privilege of privilegesData) {
      const p = await this.privilegeRepository.findOne({
        where: { key: privilege.key },
      });
      if (p) {
        continue;
      }
      await this.privilegeRepository.create({
        doc: {
          key: privilege.key,
          name: privilege.name,
          description: privilege.description,
        },
      });
    }
  }

  async findAll(ids: number[]) {
    return await this.privilegeRepository.findAll({
      where: {
        id: { [Op.in]: ids },
      },
    });
  }

  async getAllPrivileges() {
    return await this.privilegeRepository.findAll({});
  }

  async getAllPrivilegeByKey(
    privilegeKeys:
      | privilegeKeys[]
      | universityPrivilegeKeys[]
      | adminPrivileges[],
  ) {
    return await this.privilegeRepository.findAll({
      where: { key: { [Op.in]: privilegeKeys } },
    });
  }
}
