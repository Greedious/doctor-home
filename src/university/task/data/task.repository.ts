import { Injectable } from '@nestjs/common';
import { TaskTemplate, TaskTemplateDocument } from './task-template.schema';
import { BaseMongoRepository } from 'package/database/mongodb/mongodb.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notes, NotesDocument, Task, TaskDocument } from './task.schema';

@Injectable()
export class TaskTemplateRepository extends BaseMongoRepository<
  TaskTemplate,
  TaskTemplateDocument
> {
  constructor(
    @InjectModel(TaskTemplate.name)
    taskRepository: Model<TaskTemplateDocument>,
  ) {
    super(taskRepository);
  }
}

@Injectable()
export class TaskRepository extends BaseMongoRepository<Task, TaskDocument> {
  constructor(
    @InjectModel(Task.name)
    taskRepository: Model<TaskDocument>,
  ) {
    super(taskRepository);
  }
}

@Injectable()
export class NotesRepository extends BaseMongoRepository<Notes, NotesDocument> {
  constructor(
    @InjectModel(Notes.name)
    notesRepository: Model<NotesDocument>,
  ) {
    super(notesRepository);
  }
}
