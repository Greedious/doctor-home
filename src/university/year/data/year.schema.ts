import { language } from 'package/utils/language/language';
import {
  BeforeDestroy,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/university/group/data/group.schema';
import { Subject } from 'src/university/subject/data/subject.schema';

@Table({
  timestamps: true,
  tableName: 'years',
  modelName: 'Year',
})
export class Year extends Model<Year> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: language;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: false,
  })
  rank: number;

  @HasMany(() => Group)
  groups: Group[];

  @HasMany(() => Subject)
  subjects: Subject[];

  @BeforeDestroy
  static async beforeDestroyHook(instance: Year) {
    await Group.destroy({ where: { yearId: instance.id } });
  }
}
