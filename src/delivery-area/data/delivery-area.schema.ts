import { language } from 'package/utils/language/language';
import { Table, Model, Column, DataType } from 'sequelize-typescript';

export const lastLevel = 1;

@Table({
  tableName: 'delivery_areas',
  modelName: 'DeliveryArea',
})
export class DeliveryArea extends Model<DeliveryArea> {
  @Column({ type: DataType.JSONB, allowNull: false })
  area: language;

  @Column({ type: DataType.JSONB, allowNull: false })
  time: language;
}
