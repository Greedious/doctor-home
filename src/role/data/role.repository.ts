import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Role } from './role.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RoleRepository extends SequelizeRepository<Role> {
  constructor(
    @InjectModel(Role)
    roleRepository: typeof Role,
  ) {
    super(roleRepository);
  }
}
