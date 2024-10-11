import { language } from 'package/utils/language/language';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Student } from 'src/university/student/data/student.schema';
import { Subject } from 'src/university/subject/data/subject.schema';

@Table({
  timestamps: true,
  tableName: 'chairs',
  modelName: 'Chair',
})
export class Chair extends Model<Chair> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: language;

  @Column({ type: DataType.INTEGER, allowNull: false })
  capacity: number;

  @HasMany(() => ChairStudent)
  student: ChairStudent[];

  @BelongsToMany(() => Subject, () => ChairSubject)
  subjects: Subject[];
}

@Table({
  tableName: 'chair_students',
  modelName: 'ChairStudent',
})
export class ChairStudent extends Model<ChairStudent> {
  @ForeignKey(() => Student)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => Chair)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chairId: number;

  @BelongsTo(() => Chair)
  chair: Chair;
}

@Table({ tableName: 'chair_subjects', modelName: 'chair_subjects' })
export class ChairSubject extends Model<ChairSubject> {
  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => Chair)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chairId: number;

  @BelongsTo(() => Chair)
  chair: Chair;
}
