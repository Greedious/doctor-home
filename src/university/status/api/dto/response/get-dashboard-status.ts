import { Status } from 'src/university/status/data/status.schema';
import { universityStatus } from '../request';

export class GetStatusesDashboardResponse {
  id: number;
  status: universityStatus;

  constructor({
    status,
    languageKey,
  }: {
    status: Status;
    languageKey: string;
  }) {
    this.id = status.id;
    this.status = status.status;
  }

  toObject(): {
    id: number;
    status: universityStatus;
  } {
    return {
      id: this.id,
      status: this.status,
    };
  }
}
