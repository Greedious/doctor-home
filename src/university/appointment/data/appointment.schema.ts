import { language } from 'package/utils/language/language';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Chair } from 'src/university/chair/data/chair.schema';
import { Patient } from 'src/university/patient/data/patient.schema';
import { Student } from 'src/university/student/data/student.schema';
import { Subject } from 'src/university/subject/data/subject.schema';

@Table({
  tableName: 'appointments',
  modelName: 'Appointment',
  createdAt: true,
})
export class Appointment extends Model<Appointment> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => Student)
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => Subject)
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => Chair)
  chairId: number;

  @BelongsTo(() => Chair)
  chair: Chair;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => Patient)
  patientId: number;

  @BelongsTo(() => Patient)
  patient: Patient;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  from: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  to: Date;
}
