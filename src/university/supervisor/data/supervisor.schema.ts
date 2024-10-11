import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Specialty } from 'src/university/specialty/data/specialty.schema';
import { Subject } from 'src/university/subject/data/subject.schema';

@Table({
  timestamps: true,
  tableName: 'supervisors',
  modelName: 'Supervisor',
})
export class Supervisor extends Model<Supervisor> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fatherName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  motherName: string;

  @Column({
    type: DataType.DATE,
  })
  birthDate: string;

  @ForeignKey(() => Specialty)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  specialtyId: number;

  @BelongsTo(() => Specialty)
  specialty: Specialty;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;
}
