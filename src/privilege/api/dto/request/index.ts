import { GetByCriteria } from 'package/pagination/dto';

export enum PrivilegeTypeEnum {
  ALL = 'All',
  E_COMMERCE = 'E-commerce',
  UNIVERSITY = 'University',
}
export class GetPrivilegesCriteria extends GetByCriteria {
  type?: PrivilegeTypeEnum;
}
