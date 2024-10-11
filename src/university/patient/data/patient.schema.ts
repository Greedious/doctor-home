import { Subject } from 'src/university/subject/data/subject.schema';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Image } from 'src/image/data/image.schema';
import { Student } from 'src/university/student/data/student.schema';
import { Teacher } from 'src/university/teacher/data/teacher.schema';
import mongoose from 'mongoose';
import { TaskTemplateDocument } from 'src/university/task/data/task-template.schema';
import { Answer } from '../api/dto/request';

export enum PatientStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}
@Table({
  tableName: 'patients',
  modelName: 'Patient',
  paranoid: true,
  createdAt: true,
})
export class Patient extends Model<Patient> {
  @Column({ type: DataType.STRING })
  nationalId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phoneNumber: string;

  @Column({ type: DataType.STRING })
  address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  availableTime: string;

  @Column({ type: DataType.STRING, allowNull: false })
  task: mongoose.Types.ObjectId | TaskTemplateDocument;

  @Column({ type: DataType.STRING })
  previousDiseases: string;

  @Column({ type: DataType.STRING })
  previousDentalDiseases: string;

  @Column({ type: DataType.STRING, defaultValue: PatientStatus.PENDING })
  status: PatientStatus;

  @Column({ type: DataType.ARRAY(DataType.JSONB), allowNull: true })
  answers: Answer[];

  // Associations
  @HasMany(() => Image)
  attachments: Image[];

  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subjectId: number;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: true })
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;

  @ForeignKey(() => Teacher)
  @Column({ type: DataType.INTEGER })
  teacherId: number;

  @BelongsTo(() => Teacher)
  teacher: Teacher;
}
