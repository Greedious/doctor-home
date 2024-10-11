import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';
import { CreateGroupRequest } from 'src/university/group/api/dto/request';

export class CreateYearRequest {
  name: language;
  rank: number;
  groupsIds: number[];
}

export class UpdateYearRequest {
  id?: number;
  name?: language;
  rank?: number;
  groupsIds: number[];
}

export class GetYearsQuery extends GetByCriteria {
  search?: string;
}
