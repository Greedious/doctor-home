import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export interface Modification {
  oldValue: boolean | string;
  newValue: boolean | string;
}
export class CreateSupervisorLogRequest {
  name: language;
}

export class UpdateSupervisorLogRequest {
  id?: number;
  name: language;
}

export class GetSupervisorLogsQuery extends GetByCriteria {
  studentId?: number;
}
