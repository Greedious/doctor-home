import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleRequest, UpdateRole } from '../api/dto/request';
import { PrivilegeService } from 'src/privilege/service/privilege.service';
import { Params } from 'package/component/params/params';
import { RoleError } from './role-error.service';
import { Role } from 'src/role/data/role.schema';
import { RoleRepository } from '../data/role.repository';
import { ConfigService } from '@nestjs/config';
import { Types } from 'src/account/user/data/user.schema';
import { Privilege } from 'src/privilege/data/privilege.schema';

@Injectable()
export class RoleDashboardService {
  constructor(
    private roleRepository: RoleRepository,
    private roleError: RoleError,
    private privilegeService: PrivilegeService,
  ) {}

  async findOneById(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id, role: Types.ADMIN },
      include: [Privilege],
      error: this.roleError.notFound(),
    });
    return role;
  }

  async findAll() {
    const roles = await this.roleRepository.findAll({
      where: { role: Types.ADMIN },
    });

    return roles;
  }

  async isValidPrivileges(privileges: number[]) {
    const databasePrivileges = await this.privilegeService.findAll(privileges);
    if (databasePrivileges.length !== privileges.length) {
      throw new HttpException({}, HttpStatus.NOT_FOUND);
    }
    return databasePrivileges;
  }

  async create(body: CreateRoleRequest) {
    const { name } = body;

    const role = await this.roleRepository.create({
      doc: {
        name,
      },
    });
    await role.$add('privileges', body.privileges);

    return {
      id: role.id,
    };
  }

  async update(body: UpdateRole, params: Params, role: Role) {
    console.log(body);
    await this.roleRepository.update({
      where: { id: params.id, role: Types.ADMIN },
      update: body,
    });
    if (body.privileges.length) {
      await role.$set('privileges', body.privileges);
    }
  }

  async delete(id: number) {
    const role = await this.findOneById(id);
    await role.destroy();
    return;
  }
}
