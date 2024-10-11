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
  tableName: 'university_operators',
  modelName: 'UniversityOperator',
  paranoid: true,
})
export class UniversityOperator extends Model {
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
