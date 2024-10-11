import { language } from 'package/utils/language/language';
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
import { Teacher } from 'src/university/teacher/data/teacher.schema';
import { Modification } from '../api/dto/request';

@Table({
  timestamps: true,
  tableName: 'supervisor-logs',
  modelName: 'SupervisorLog',
})
export class SupervisorLog extends Model<SupervisorLog> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Student)
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;

  @Column({ type: DataType.JSONB, allowNull: false })
  task: language;

  @Column({ type: DataType.INTEGER, allowNull: false })
  index: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ForeignKey(() => Teacher)
  teacherId: number;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Subject)
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @Column({ type: DataType.JSONB, allowNull: false })
  fieldName: language;

  @Column({ type: DataType.JSONB, allowNull: false })
  modification: Modification;
}
