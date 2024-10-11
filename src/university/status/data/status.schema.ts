import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { universityStatus } from '../api/dto/request';

@Table({
  timestamps: true,
  tableName: 'statuses',
  modelName: 'Status',
})
export class Status extends Model<Status> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  status: universityStatus;
}
