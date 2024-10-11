import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/category/data/category.schema';

@Table({
  tableName: 'discounts',
  modelName: 'Discount',
  timestamps: true,
  paranoid: true,
})
export class Discount extends Model<Discount> {
  @Column({
    type: DataType.INTEGER,
  })
  percentage: number; // 1 -> 100 inclusive

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  value: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  from: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  to: string;

  // Associations:
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
  })
  subcategoryId: number;

  @BelongsTo(() => Category)
  subcategory: Category;
}
