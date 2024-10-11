import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { RequestPatient } from './request-patient.schema';
import { InjectModel } from '@nestjs/sequelize';
import { TaskRepository } from 'src/university/task/data/task.repository';
import mongoose from 'mongoose';

@Injectable()
export class RequestPatientRepository extends SequelizeRepository<RequestPatient> {
  constructor(
    @InjectModel(RequestPatient)
    requestPatientRepository: typeof RequestPatient,
    private taskRepository: TaskRepository,
  ) {
    super(requestPatientRepository);
  }

  async findSuitableStudent({
    subjectId,
    task,
  }: {
    subjectId: number;
    task: mongoose.Types.ObjectId;
  }) {
    let students: RequestPatient[] | number[] = await this.findAll({
      where: {
        subjectId,
        task,
      },
    });

    students = students.map((student) => student.studentId) as number[];
    const tasks = await this.taskRepository.find({
      filter: {
        parentTask: new mongoose.Types.ObjectId(task),
        subjectId,
        studentId: { $in: students },
      },
    });

    let maxValue = 0;
    let studentId = 0;
    tasks.map((task) => {
      if (maxValue <= task.remaining) {
        maxValue = task.remaining;
        studentId = task.studentId;
      }
    });

    await this.delete({
      where: { studentId, subjectId, task: task.toString() },
    });

    return studentId;
  }
}
