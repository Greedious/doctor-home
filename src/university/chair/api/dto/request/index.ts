import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export class CreateChairRequest {
  name: language;
  capacity: number;
  subjectIds: number[];
}

export class UpdateChairRequest {
  id?: number;
  name?: language;
  capacity?: number;
  subjectIds?: number[];
}

export class GetChairsQuery extends GetByCriteria {
  search?: string;
  subject?: number[];
}

export class LinkStudentToChairRequest {
  studentsIds: number[];
  subjectId: number;
  chairId: number;
}
