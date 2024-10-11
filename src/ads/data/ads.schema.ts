import { language } from 'package/utils/language/language';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript';
import { Image } from 'src/image/data/image.schema';

export const lastLevel = 1;

@Table({
  tableName: 'ads',
  modelName: 'Ads',
})
export class Ads extends Model<Ads> {
  @ForeignKey(() => Image)
  @Column({
    type: DataType.INTEGER,
  })
  imageId?: number;

  @BelongsTo(() => Image)
  image?: Image;

  @Column({ type: DataType.STRING, allowNull: true })
  url: string;

  @Column({
    type: DataType.JSONB,
  })
  description: language;

  @Column({ type: DataType.INTEGER })
  rank: number;
}
