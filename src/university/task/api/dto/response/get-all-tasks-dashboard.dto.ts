import { language } from 'package/utils/language/language';
import { TaskTemplate } from 'src/university/task/data/task-template.schema';

export interface IGetByCriteriaTasksDashboardResponse {
  id: number;
  task: string;
}

export class GetByCriteriaTasksDashboardResponse {
  id: number;
  task: string;

  constructor({
    task,
    languageKey,
  }: {
    task: TaskTemplate;
    languageKey: string;
  }) {}

  toObject(): IGetByCriteriaTasksDashboardResponse {
    return {
      id: this.id,
      task: this.task,
    };
  }
}
