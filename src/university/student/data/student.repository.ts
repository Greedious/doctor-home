import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from './student.schema';

@Injectable()
export class StudentRepository extends SequelizeRepository<Student> {
  constructor(
    @InjectModel(Student)
    studentRepository: typeof Student,
  ) {
    super(studentRepository);
  }
}
