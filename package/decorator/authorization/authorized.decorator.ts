import { UseGuards, applyDecorators } from '@nestjs/common';
import { Roles } from './role-set-metadata.role';
import { RoleGuard } from 'package/guards/role.guard';
import { Privileges } from './privilege-set-metadata.decorator';
import { PrivilegeGuard } from 'package/guards/privilege.guard';
import {
  privilegeKeys,
  universityPrivilegeKeys,
} from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';

export function Authorized({
  role,
  privilege,
}: {
  role: Types[];
  privilege: privilegeKeys[] | universityPrivilegeKeys[];
}) {
  return applyDecorators(
    Roles(role),
    Privileges(privilege),
    UseGuards(RoleGuard),
    UseGuards(PrivilegeGuard),
  );
}
