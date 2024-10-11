import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { Api } from 'package/utils/api-methods';
import { Authorized } from './authorized.decorator';
import { ApiMethods } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import {
  privilegeKeys,
  universityPrivilegeKeys,
} from 'src/privilege/data/privilege.schema';

export function AuthorizedApi({
  api,
  url,
  role = [],
  privilege = [],
}: {
  api: Api;
  url: string;
  role?: Types[];
  privilege?: privilegeKeys[] | universityPrivilegeKeys[];
}) {
  return applyDecorators(
    Authorized({ role, privilege }),
    api === Api.POST ? HttpCode(HttpStatus.CREATED) : HttpCode(HttpStatus.OK),
    new ApiMethods(url).get(api),
  );
}
