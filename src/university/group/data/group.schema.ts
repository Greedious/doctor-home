import { language } from 'package/utils/language/language';
import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
  HasMany,
} from 'sequelize-typescript';
import { Subject } from 'src/university/subject/data/subject.schema';
import { Year } from 'src/university/year/data/year.schema';

@Table({
  modelName: 'Group',
  tableName: 'groups',
})
export class Group extends Model<Group> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: language;

  // Associations:
  @ForeignKey(() => Year)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  yearId: number;

  @BelongsTo(() => Year)
  year: Year;

  @HasMany(() => GroupSchedule)
  groupSchedules: GroupSchedule[];
}

@Table({
  modelName: 'GroupSchedule',
  tableName: 'group_schedules',
})
export class GroupSchedule extends Model<GroupSchedule> {
  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dayOfWeek: number;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime: string;
}
