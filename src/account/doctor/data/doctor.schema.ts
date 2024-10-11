import mongoose from 'mongoose';
import {
  Table,
  Model,
  Column,
  BelongsTo,
  DataType,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { User } from 'src/account/user/data/user.schema';
import { Student } from 'src/university/student/data/student.schema';
import { Supervisor } from 'src/university/supervisor/data/supervisor.schema';
import { Teacher } from 'src/university/teacher/data/teacher.schema';

@Table({
  tableName: 'doctors',
  modelName: 'Doctor',
})
export class Doctor extends Model<Doctor> {
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId?: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: true })
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;

  @ForeignKey(() => Teacher)
  @Column({ type: DataType.INTEGER, allowNull: true })
  teacherId: number;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @ForeignKey(() => Supervisor)
  @Column({ type: DataType.INTEGER, allowNull: true })
  supervisorId: number;

  @BelongsTo(() => Supervisor)
  supervisor: Supervisor;
}
