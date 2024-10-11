import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/account/user/data/user.schema';
import { Product } from 'src/product/data/product.schema';

@Table({
  tableName: 'reviews',
  modelName: 'Review',
  timestamps: true,
  paranoid: true,
})
export class Review extends Model<Review> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  rate: number;

  @Column({ type: DataType.STRING, allowNull: true })
  comment?: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;
}
