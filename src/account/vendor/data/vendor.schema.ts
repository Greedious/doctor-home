import {
  DataType,
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/account/user/data/user.schema';
import { Discount } from 'src/discount/data/discount.schema';

@Table({
  tableName: 'vendors',
  modelName: 'Vendor',
  paranoid: true,
})
export class Vendor extends Model<Vendor> {
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
