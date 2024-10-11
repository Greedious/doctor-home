import { language } from 'package/utils/language/language';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'specialties',
  modelName: 'Specialty',
})
export class Specialty extends Model<Specialty> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: language;
}
