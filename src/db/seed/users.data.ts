import { castRelations } from 'package/database/casting';
import { Types, User } from 'src/account/user/data/user.schema';
import { Role } from 'src/role/data/role.schema';

export const usersData = [
  {
    username: 'admin',
    password: '12345678',
    isActive: true,
    type: Types.SUPER_ADMIN,
    builtIn: true,
  },
  {
    username: 'admin2',
    password: '12345678',
    isActive: true,
    type: Types.ADMIN,
    roleId: 3,
    builtIn: true,
  },
  {
    username: 'university_admin',
    password: '12345678',
    isActive: true,
    type: Types.UNIVERSITY_SUPER_ADMIN,
    roleId: 3,
    builtIn: true,
  },
  {
    username: 'university_admin2',
    password: '12345678',
    isActive: true,
    type: Types.UNIVERSITY_ADMIN,
    roleId: 3,
    builtIn: true,
  },
];
