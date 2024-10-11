import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/category/data/category.schema';
import { Patient } from 'src/university/patient/data/patient.schema';

@Table({
  tableName: 'images',
  modelName: 'Image',
  paranoid: true,
  timestamps: true,
})
export class Image extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  key: string;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
  })
  width: number;

  @Column({
    type: DataType.INTEGER,
  })
  height: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  fileSize: number;

  //

  // @HasMany(() => Ads)
  // ads: Ads[];

  @HasMany(() => Category)
  categories: Category[];

  @ForeignKey(() => Patient)
  @Column({ type: DataType.INTEGER, allowNull: true })
  patientId: number;

  @BelongsTo(() => Patient)
  patient: Patient;
}
