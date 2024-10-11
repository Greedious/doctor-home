import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { SupervisedGroup, Teacher, TeacherSubject } from './teacher.schema';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class TeacherRepository extends SequelizeRepository<Teacher> {
  constructor(
    @InjectModel(Teacher)
    teacherRepository: typeof Teacher,
  ) {
    super(teacherRepository);
  }

  // async findFreeTeachers() {
  //   const query = `
  //     SELECT DISTINCT(t.*) FROM teachers t
  //     LEFT JOIN teacher_subjects ts ON t."id" = ts."teacherId"
  //     LEFT JOIN supervised_groups sg ON ts."teacherId" = sg."teacherSubjectId"
  //     WHERE ts."teacherId" IS NULL
  //     OR sg."teacherSubjectId" IS NULL;
  //   `;
  //   const teachers = await Teacher.sequelize.query(query, {
  //     type: QueryTypes.SELECT,
  //   });
  //   const query1 = `
  //     SELECT DISTINCT(t.*) FROM teachers t
  //     LEFT JOIN teacher_subjects ts ON t."id" = ts."teacherId"
  //     LEFT JOIN supervised_groups sg ON ts."teacherId" = sg."teacherSubjectId"
  //     WHERE ts."teacherId" IS NOT NULL
  //     OR sg."teacherSubjectId" IS NOT NULL;
  //   `;
  //   const teachers1 = await Teacher.sequelize.query(query1, {
  //     type: QueryTypes.SELECT,
  //   });
  //   return {
  //     free_teachers: teachers,
  //     non_free_teachers: teachers1,
  //   };
  //   const freeTeachers = await Teacher.findAll({
  //     include: [
  //       {
  //         model: TeacherSubject,
  //         required: false,
  //         include: [{ model: SupervisedGroup, required: true }],
  //       },
  //     ],
  //     where: {
  //       $subjects$: { [Op.is]: null },
  //     },
  //   });

  //   const nonFreeTeachers = await Teacher.findAll({
  //     include: [
  //       {
  //         model: TeacherSubject,
  //         required: true,
  //         include: [{ model: SupervisedGroup, required: true }],
  //       },
  //     ],
  //   });
  //   return {
  //     freeTeachers,
  //     nonFreeTeachers,
  //   };
  // }
}
@Injectable()
export class TeacherSubjectRepository extends SequelizeRepository<TeacherSubject> {
  constructor(
    @InjectModel(TeacherSubject)
    teacherSubjectRepository: typeof TeacherSubject,
  ) {
    super(teacherSubjectRepository);
  }
}
@Injectable()
export class SupervisedGroupRepository extends SequelizeRepository<SupervisedGroup> {
  constructor(
    @InjectModel(SupervisedGroup)
    supervisedGroupRepository: typeof SupervisedGroup,
  ) {
    super(supervisedGroupRepository);
  }
}
