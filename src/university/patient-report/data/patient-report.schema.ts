import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Patient } from 'src/university/patient/data/patient.schema';

@Table({
  tableName: 'patients_reports',
  modelName: 'PatientReport',
  createdAt: true,
})
export class PatientReport extends Model<PatientReport> {
  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  age: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  // associations

  @BelongsTo(() => Patient)
  patient: Patient;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.INTEGER, allowNull: false })
  patientId: number;
}
