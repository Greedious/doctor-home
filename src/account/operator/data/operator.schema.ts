import {
  DataType,
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/account/user/data/user.schema';

@Table({
  tableName: 'operators',
  modelName: 'Operator',
  paranoid: true,
})
export class Operator extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
