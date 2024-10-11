import { language } from 'package/utils/language/language';
import { TaskTemplate } from 'src/university/task/data/task-template.schema';

export interface IGetByIdTaskDashboardResponse {
  id: number;
  task: language;
}

export class GetByIdTaskDashboardResponse {
  id: number;
  task: language;

  constructor({
    task,
    languageKey,
  }: {
    task: TaskTemplate;
    languageKey: string;
  }) {}

  toObject(): IGetByIdTaskDashboardResponse {
    return {
      id: this.id,
      task: this.task,
    };
  }
}
