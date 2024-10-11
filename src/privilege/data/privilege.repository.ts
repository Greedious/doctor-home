import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Privilege } from './privilege.schema';

@Injectable()
export class PrivilegeRepository extends SequelizeRepository<Privilege> {
  constructor(
    @InjectModel(Privilege)
    privilegeRepository: typeof Privilege,
  ) {
    super(privilegeRepository);
  }
}
