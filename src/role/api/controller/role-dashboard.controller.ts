import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { RoleDashboardService } from 'src/role/service/role-dashboard.service';
import { CreateRoleRequest, UpdateRoleRequest } from '../dto/request';
import { RoleValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { GetByCriteriaRoleResponse } from '../dto/response/get-all-roles.dto';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { GetByIdRoleResponse } from '../dto/response/get-by-id.dto';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';

@AuthenticatedController({ controller: 'roles' })
export class RoleDashboardController {
  constructor(
    private readonly roleService: RoleDashboardService,
    private readonly roleValidation: RoleValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [privilegeKeys.createRole],
    role: [Types.SUPER_ADMIN],
  })
  async create(@Body() body: CreateRoleRequest) {
    this.roleValidation.create({ body });
    await this.roleService.isValidPrivileges(body.privileges as number[]);
    return await this.roleService.create(body);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [privilegeKeys.updateRole],
    role: [Types.SUPER_ADMIN],
  })
  async update(@Body() body: UpdateRoleRequest, @Param() params: Params) {
    this.roleValidation.update({ body, params });
    const role = await this.roleService.findOneById(params.id);
    let privileges = undefined;
    if (body.privileges) {
      privileges = await this.roleService.isValidPrivileges(
        body.privileges as number[],
      );
    }
    return await this.roleService.update({ ...body, privileges }, params, role);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [privilegeKeys.viewRole],
    role: [Types.SUPER_ADMIN],
  })
  async getAll(@Headers() header: IHeaders) {
    const roles = await this.roleService.findAll();
    return {
      rows: roles.map((role) =>
        new GetByCriteriaRoleResponse({
          role,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [privilegeKeys.viewRole],
    role: [Types.SUPER_ADMIN],
  })
  async getOne(@Headers() headers: IHeaders, @Param() params: Params) {
    this.roleValidation.paramsId({ params });
    const role = await this.roleService.findOneById(+params.id);
    return new GetByIdRoleResponse({ role, languageKey: headers.languageKey });
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [privilegeKeys.deleteOperator],
    role: [Types.SUPER_ADMIN],
  })
  async delete(@Param() params: Params) {
    this.roleValidation.paramsId({ params });
    await this.roleService.delete(+params.id);
  }
}
