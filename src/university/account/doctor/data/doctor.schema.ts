import {
  Table,
  Model,
  Column,
  BelongsTo,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/account/user/data/user.schema';
@Table({
  tableName: 'doctors',
  modelName: 'Doctor',
})
export class Doctor extends Model<Doctor> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId?: number;

  @BelongsTo(() => User)
  user: User;
}
