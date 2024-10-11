import { language } from 'package/utils/language/language';
import {
  BeforeDestroy,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/product/data/product.schema';
import { Sku, SkuProduct } from 'src/sku/data/sku.schema';

export enum VariantType {
  TEXT = 'Text',
  NUMBER = 'Number',
  COLOR = 'Color',
}

@Table({
  tableName: 'variants',
  modelName: 'Variant',
})
export class Variant extends Model<Variant> {
  @Column({
    type: DataType.JSONB,
    defaultValue: { en: '', ar: '' },
  })
  name: language;

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  key: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  values: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: VariantType;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @HasMany(() => SkuProduct, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  skusProduct: SkuProduct[];
}
