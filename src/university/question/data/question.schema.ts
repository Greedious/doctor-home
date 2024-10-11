import { language } from 'package/utils/language/language';
import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'questions',
  modelName: 'Question',
})
export class Question extends Model<Question> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  question: language;
}
