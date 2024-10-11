import { TaskTemplate } from 'src/university/task/data/task-template.schema';

export interface IGetByIdTaskMobileResponse {
  id: number;
  task: string;
}

export class GetByIdTaskMobileResponse {
  id: number;
  task: string;

  constructor({
    task,
    languageKey,
  }: {
    task: TaskTemplate;
    languageKey: string;
  }) {}

  toObject(): IGetByIdTaskMobileResponse {
    return {
      id: this.id,
      task: this.task,
    };
  }
}
