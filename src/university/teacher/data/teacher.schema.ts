import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/university/group/data/group.schema';
import { Specialty } from 'src/university/specialty/data/specialty.schema';
import { Subject } from 'src/university/subject/data/subject.schema';

@Table({
  timestamps: true,
  tableName: 'teachers',
  modelName: 'Teacher',
})
export class Teacher extends Model<Teacher> {
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

  @HasMany(() => TeacherSubject)
  subjects: TeacherSubject[];
}

@Table({
  tableName: 'teacher_subjects',
  modelName: 'TeacherSubject',
})
export class TeacherSubject extends Model<TeacherSubject> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Teacher)
  @Column({ type: DataType.INTEGER, allowNull: false })
  teacherId: number;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @HasMany(() => SupervisedGroup)
  supervisedGroups: SupervisedGroup[];
}

@Table({
  timestamps: true,
  tableName: 'supervised_groups',
  modelName: 'SupervisedGroup',
})
export class SupervisedGroup extends Model<SupervisedGroup> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => TeacherSubject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  teacherSubjectId: number;

  @BelongsTo(() => TeacherSubject)
  teacherSubject: TeacherSubject;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER, allowNull: false })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;
}
