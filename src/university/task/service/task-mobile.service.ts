import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  TaskRepository,
  TaskTemplateRepository,
} from '../data/task.repository';
import { TaskError } from './task-error.service';
import { IUser } from 'src/shared/types/user';
import { FieldType } from '../api/dto/request';
import { TaskDocument } from '../data/task.schema';
import mongoose from 'mongoose';
import { TaskTemplateDocument } from '../data/task-template.schema';

@Injectable()
export class TaskMobileService {
  constructor(
    private taskRepository: TaskRepository,
    private taskTemplateRepository: TaskTemplateRepository,
    private taskError: TaskError,
  ) {}

  async findOneById(id: number) {
    // const task = await this.taskRepository.findOne({
    //   where: { id },
    //   error: this.taskError.notFound(),
    // });
    // return task;
  }

  async findOne(id: number) {
    const task = await this.findOneById(id);
    return task;
  }

  async update() {}

  async findAll(filter: mongoose.FilterQuery<TaskTemplateDocument>) {
    return await this.taskTemplateRepository.find({
      filter,
    });
  }

  async findAllNotes() {}
}
