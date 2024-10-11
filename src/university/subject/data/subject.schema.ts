import { language } from 'package/utils/language/language';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Chair, ChairSubject } from 'src/university/chair/data/chair.schema';
import { GroupSchedule } from 'src/university/group/data/group.schema';
import {
  Teacher,
  TeacherSubject,
} from 'src/university/teacher/data/teacher.schema';
import { Year } from 'src/university/year/data/year.schema';

@Table({
  tableName: 'subjects',
  modelName: 'Subject',
})
export class Subject extends Model<Subject> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: language;

  @Column({ type: DataType.INTEGER, allowNull: false })
  season: number;

  @ForeignKey(() => Year)
  @Column({ type: DataType.INTEGER, allowNull: false })
  yearId: number;

  @BelongsTo(() => Year)
  year: Year;

  @BelongsToMany(() => Chair, () => ChairSubject)
  chair: Chair[];

  @BelongsToMany(() => Teacher, () => TeacherSubject)
  teachers: Teacher[];

  @HasMany(() => GroupSchedule)
  groupSchedules: GroupSchedule[];
}
