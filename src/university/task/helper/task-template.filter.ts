import mongoose from 'mongoose';
import { TaskTemplateDocument } from '../data/task-template.schema';

export class TaskTemplateFilter {
  filter: mongoose.FilterQuery<TaskTemplateDocument>;

  constructor() {
    this.filter = {
      $and: [],
      $or: [],
    };
  }

  getSubject(subjectId: number) {
    if (!subjectId) {
      return this;
    }
    this.filter.$and.push({
      subjectId,
    });
    return this;
  }

  build() {
    const result: mongoose.FilterQuery<TaskTemplateDocument> = {};
    if (this.filter.$and.length) result['$and'] = this.filter.$and;
    if (this.filter.$or.length) result['$or'] = this.filter.$or;
    return result;
  }
}
