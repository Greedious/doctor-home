import { language } from 'package/utils/language/language';
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { Operator } from 'src/account/operator/data/operator.schema';
import { Category } from 'src/category/data/category.schema';
import { Favorite } from 'src/favorite/data/favorite.schema';
import { Image } from 'src/image/data/image.schema';
import { Review } from 'src/review/data/review.schema';
import { Sku } from 'src/sku/data/sku.schema';
import { Variant } from 'src/variant/data/variant.schema';

@Table({
  tableName: 'products',
  modelName: 'Product',
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: language;

  @Column({ type: DataType.JSONB, allowNull: false })
  description: language;

  @Column({ type: DataType.INTEGER, allowNull: false })
  mainPrice: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  quantity: number;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
    defaultValue: [0, 0, 0, 0, 0],
  })
  reviewCount: number[];

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  rateSum: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  totalRates: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @ForeignKey(() => Sku)
  @Column({ type: DataType.INTEGER, allowNull: true })
  defaultSkuId: number;

  @HasOne(() => Sku, { foreignKey: 'productId', as: 'defaultSku' })
  defaultSku: Sku;

  @ForeignKey(() => Operator)
  @Column({ type: DataType.INTEGER })
  operatorId: number;

  @BelongsTo(() => Operator)
  operator: Operator;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  categoryId: number;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  subcategoryId: number;

  @ForeignKey(() => Image)
  @Column({ type: DataType.INTEGER })
  imageId: number;

  @BelongsTo(() => Image)
  image: Image;

  @HasMany(() => Favorite)
  favorites: Favorite[];

  @BelongsTo(() => Category, 'categoryId')
  category: Category;

  @BelongsTo(() => Category, 'subcategoryId')
  subcategory: Category;

  @HasMany(() => Variant)
  variants: Variant[];

  @HasMany(() => Sku, { as: 'skus' })
  skus: Sku[];

  @HasMany(() => Review)
  reviews: Review[];
}
