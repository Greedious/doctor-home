import {
  BeforeDestroy,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/account/user/data/user.schema';

@Table({
  modelName: 'Address',
  tableName: 'addresses',
  paranoid: true,
  timestamps: true,
})
export class Address extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  zone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  street: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  building: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  floor: string;

  @Column({
    type: DataType.STRING,
  })
  flat: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
