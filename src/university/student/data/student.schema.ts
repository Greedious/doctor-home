import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Doctor } from 'src/account/doctor/data/doctor.schema';
import { Chair, ChairStudent } from 'src/university/chair/data/chair.schema';
import { Group } from 'src/university/group/data/group.schema';
import { Patient } from 'src/university/patient/data/patient.schema';
import { Year } from 'src/university/year/data/year.schema';

@Table({
  timestamps: true,
  tableName: 'students',
  modelName: 'Student',
})
export class Student extends Model<Student> {
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

  // Associations:
  @ForeignKey(() => Year)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  yearId: number;

  @BelongsTo(() => Year)
  year: Year;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @HasOne(() => Doctor)
  doctor: Doctor;

  @HasMany(() => ChairStudent)
  chairs: ChairStudent[];

  @HasMany(() => Patient)
  patients: Patient[];
}
