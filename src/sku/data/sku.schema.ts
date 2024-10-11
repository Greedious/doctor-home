import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
  HasMany,
  BeforeDestroy,
} from 'sequelize-typescript';
import { Image } from 'src/image/data/image.schema';
import { Product } from 'src/product/data/product.schema';
import { Variant } from 'src/variant/data/variant.schema';

// SKU = Stock Keep Unit

@Table({
  tableName: 'skus',
  modelName: 'Sku',
})
export class Sku extends Model<Sku> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  price: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Image)
  @Column({ type: DataType.INTEGER, allowNull: false })
  imageId: number;

  @BelongsTo(() => Image)
  image: Image;

  @HasMany(() => SkuProduct, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  skusProduct: SkuProduct[];
}

@Table({
  tableName: 'sku_products',
  modelName: 'SkuProduct',
})
export class SkuProduct extends Model<SkuProduct> {
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  key: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  value: string;

  @ForeignKey(() => Sku)
  @Column({ type: DataType.INTEGER, allowNull: false })
  skuId: number;

  @BelongsTo(() => Sku)
  sku: Sku;

  @ForeignKey(() => Variant)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productVariantId: number;

  @BelongsTo(() => Variant)
  variants: Variant;
}
