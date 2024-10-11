import { language } from 'package/utils/language/language';
import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  BeforeDestroy,
} from 'sequelize-typescript';
import { Image } from 'src/image/data/image.schema';

export const lastLevel = 1;

@Table({
  tableName: 'categories',
  modelName: 'Category',
})
export class Category extends Model<Category> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: language;

  @ForeignKey(() => Image)
  @Column({ type: DataType.INTEGER, allowNull: true })
  imageId?: number;

  @BelongsTo(() => Image)
  image?: Image;

  @Column({ type: DataType.INTEGER, defaultValue: lastLevel })
  level: number;

  @Column({
    type: DataType.INTEGER,
  })
  parentId: number;

  @HasMany(() => Category, { foreignKey: 'parentId', as: 'subcategories' })
  subcategories: Category[];

  @BelongsTo(() => Category, { foreignKey: 'parentId', as: 'parent' })
  parent: Category;

  @BeforeDestroy
  static async beforeDestroyHook(instance: Category) {
    // const queries: Promise<any>[] = [];
    // queries.push(Category.destroy({ where: { parentId: instance.id } }));
    // await Promise.all(queries);
  }
}
