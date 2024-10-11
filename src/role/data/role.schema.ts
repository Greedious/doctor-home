import { language } from 'package/utils/language/language';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Types, User } from 'src/account/user/data/user.schema';
import { Privilege } from 'src/privilege/data/privilege.schema';

@Table({
  tableName: 'roles',
  modelName: 'Role',
})
export class Role extends Model<Role> {
  @Column({
    type: DataType.STRING,
    defaultValue: Types.ADMIN,
  })
  role?: Types;

  @Column({
    type: DataType.JSONB,
    defaultValue: { en: '', ar: '' },
  })
  name: language;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  builtIn?: boolean;

  // Associations
  @BelongsToMany(() => Privilege, () => RolePrivilege)
  privileges: Privilege[];

  @HasMany(() => User)
  users: User;
}

@Table({
  tableName: 'role_privileges',
  modelName: 'RolePrivileges',
})
export class RolePrivilege extends Model<RolePrivilege> {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId: number;

  @ForeignKey(() => Privilege)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  privilegeId: number;
}
