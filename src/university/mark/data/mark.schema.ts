import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Student } from 'src/university/student/data/student.schema';
import { Subject } from 'src/university/subject/data/subject.schema';

@Table({
  tableName: 'marks',
  modelName: 'Mark',
  createdAt: true,
})
export class Mark extends Model<Mark> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  mark: number;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: false })
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;
}
