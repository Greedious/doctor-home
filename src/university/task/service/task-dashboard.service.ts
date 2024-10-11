import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCardRequest, TaskType, UpdateTask } from '../api/dto/request';
import { MongooseParams } from 'package/component/params/params';
import { TaskError } from './task-error.service';
import { TaskTemplateRepository } from '../data/task.repository';
import mongoose from 'mongoose';

@Injectable()
export class TaskDashboardService {
  constructor(
    private taskTemplateRepository: TaskTemplateRepository,
    private taskError: TaskError,
  ) {}

  async checkForSubject(subjectId: number) {
    const task = await this.taskTemplateRepository.findOne({
      filter: { subjectId },
    });

    if (task) {
      throw new HttpException(
        this.taskError.alreadyHasCard(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneById(_id: mongoose.Types.ObjectId) {
    const task = await this.taskTemplateRepository.findOne({
      filter: { _id },
      error: this.taskError.notFound(),
    });
    return task;
  }

  async findOne({ id }: MongooseParams) {
    const task = await this.findOneById(id);
    return task;
  }

  async findAll() {
    // const tasks = await this.taskRepository.findAll({});
    // return tasks;
  }

  async delete(id: number) {
    // await this.taskRepository.delete({
    // where: { id },
    // });
    // return;
  }

  async create(body: CreateCardRequest) {
    await this.taskTemplateRepository.insertMany({
      docs: body.laboratoryTasks.map((task, index) => {
        return {
          ...task,
          type: TaskType.laboratory,
          rank: index + 1,
          subjectId: body.subjectId,
        };
      }),
    });
    await this.taskTemplateRepository.insertMany({
      docs: body.clinicalTasks.map((task, index) => {
        return {
          ...task,
          type: TaskType.clinical,
          rank: index + 1,
          subjectId: body.subjectId,
        };
      }),
    });
    return;
  }

  async update(body: UpdateTask, id: number) {
    // await this.taskRepository.update({
    //   where: { id },
    //   update: body,
    // });
  }
}
