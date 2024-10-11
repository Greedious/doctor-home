import { TaskTemplateDocument } from 'src/university/task/data/task-template.schema';

export interface IGetByCriteriaTasksMobileResponse {
  id: number;
  name: string;
}

export class GetByCriteriaTasksMobileResponse {
  id: number;
  name: string;

  constructor({
    task,
    languageKey,
  }: {
    task: TaskTemplateDocument;
    languageKey: string;
  }) {
    this.id = task._id;
    this.name = task.name[languageKey];
  }

  toObject(): IGetByCriteriaTasksMobileResponse {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
