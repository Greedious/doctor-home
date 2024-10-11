import { Subject } from 'src/university/subject/data/subject.schema';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Student } from 'src/university/student/data/student.schema';
import mongoose from 'mongoose';

@Table({
  tableName: 'request_patients',
  modelName: 'RequestPatients',
  paranoid: true,
})
export class RequestPatient extends Model<RequestPatient> {
  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subjectId: number;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: false })
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;

  @Column({ type: DataType.STRING })
  task: mongoose.Types.ObjectId;
}
