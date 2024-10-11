import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export class CreateSpecialtyRequest {
  name: language;
}

export class UpdateSpecialtyRequest {
  id?: number;
  name: language;
}

export class GetSpecialtiesQuery extends GetByCriteria {
  search?: string;
}
