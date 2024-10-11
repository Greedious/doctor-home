import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export interface CreateGroupRequest {
  name?: language;
  yearId?: number;
}

export interface UpdateGroupRequest {
  id?: number;
  name: language;
  yearId: number;
}

export class GetAllGroup extends GetByCriteria {
  search?: string;
  yearId?: number;
}

export class DeleteGroupSchedule {
  subjectId: number;
}
