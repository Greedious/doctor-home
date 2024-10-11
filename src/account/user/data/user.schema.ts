import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Table,
  Model,
  BeforeCreate,
  BeforeDestroy,
} from 'sequelize-typescript';
import { Doctor } from 'src/account/doctor/data/doctor.schema';
import { Operator } from 'src/account/operator/data/operator.schema';
import { Role } from 'src/role/data/role.schema';
import { OtpCode } from '../api/dto/type';
import { hashPassword } from 'package/utils/bcrypt/bcrypt';
import { Address } from 'src/address/data/address.schema';
import { Vendor } from 'src/account/vendor/data/vendor.schema';
import { UniversityOperator } from 'src/university/account/operator/data/operator.schema';
import { Favorite } from 'src/favorite/data/favorite.schema';
export enum Types {
  VENDOR = 'VENDOR',
  SUPER_ADMIN = 'SUPER_ADMIN',
  UNIVERSITY_SUPER_ADMIN = 'UNIVERSITY_SUPER_ADMIN',
  UNIVERSITY_ADMIN = 'UNIVERSITY_ADMIN',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  SUPERVISOR = 'SUPERVISOR',
}

@Table({
  tableName: 'users',
  modelName: 'User',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  phoneNumber: string;

  // @Column({ type: DataType.BOOLEAN, allowNull: true })
  // isChangedPassword: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  otpCode?: OtpCode;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING,
    defaultValue: Types.ADMIN,
  })
  type: Types;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  builtIn: boolean;

  // Associations:

  @ForeignKey(() => Operator)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  operatorId?: number;

  @HasOne(() => Operator)
  operator?: Operator;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  doctorId?: number;

  @HasOne(() => Doctor)
  doctor?: Doctor;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  vendorId?: number;

  @HasOne(() => Vendor)
  vendor: Vendor;

  @ForeignKey(() => UniversityOperator)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  universityOperatorId?: number;

  @HasOne(() => UniversityOperator)
  universityOperator: UniversityOperator;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
  })
  roleId?: number;

  @BelongsTo(() => Role)
  role: Role;

  @BeforeCreate
  static async hashPasswordBeforeCreate(instance: User) {
    if (instance.password)
      instance.password = await hashPassword(instance.password);

    if (instance.username) instance.username = instance.username.trim();
    if (instance.username) instance.username = instance.username.trim();
  }
  @BeforeDestroy
  static async beforeDeleteHook(instance: User) {
    const queries: Promise<any>[] = [];

    queries.push(
      Address.destroy({ where: { userId: instance.id } }),
      Favorite.destroy({ where: { userId: instance.id } }),
    );
    // if (instance.operatorId)
    //   queries.push(Operator.destroy({ where: { userId: instance.id } }));
    // if (instance.doctorId)
    //   queries.push(Doctor.destroy({ where: { userId: instance.id } }));
    // if (instance.vendorId)
    //   queries.push(Vendor.destroy({ where: { userId: instance.id } }));
    // if (instance.universityOperatorId)
    //   queries.push(
    //     UniversityOperator.destroy({ where: { userId: instance.id } }),
    //   );

    await Promise.all(queries);
  }
}
