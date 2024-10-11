import { Injectable } from '@nestjs/common';
import { rolesData } from 'src/db/seed/role.data';
import { RoleRepository } from '../data/role.repository';
import { RoleError } from './role-error.service';
import { PrivilegeService } from 'src/privilege/service/privilege.service';
import { Privilege, privilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private privilegeService: PrivilegeService,
    private roleError: RoleError,
  ) {}
  async seed() {
    for (const role of rolesData) {
      const r = await this.roleRepository.findOne({
        where: { role: role.role },
      });
      const privilegesBody: Privilege[] =
        await this.privilegeService.getAllPrivilegeByKey(role.privileges);
      if (r) {
        await r.$add('privileges', privilegesBody);
        continue;
      }
      const { privileges, ...rem } = role;
      const rr = await this.roleRepository.create({
        doc: rem,
      });
      await rr.$add('privileges', privilegesBody);
    }
  }

  async findByType(type: Types) {
    return await this.roleRepository.findOne({ where: { role: type } });
  }

  async findAdminRole(id: number) {
    return await this.roleRepository.findOne({
      where: { id, role: Types.ADMIN },
      error: this.roleError.notFound(),
    });
  }
  async findUniversityAdminRole(id: number) {
    return await this.roleRepository.findOne({
      where: { id, role: Types.UNIVERSITY_ADMIN },
      error: this.roleError.notFound(),
    });
  }
  async findVendorRole() {
    return await this.roleRepository.findOne({
      where: { role: Types.VENDOR },
      error: this.roleError.notFound(),
    });
  }
  async findDoctorRole() {
    return await this.roleRepository.findOne({
      where: { role: Types.DOCTOR },
      error: this.roleError.notFound(),
    });
  }
}
