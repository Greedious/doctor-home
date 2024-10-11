import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export class CreateDeliveryAreaRequest {
  area: language;
  time: language;
}

export class UpdateDeliveryArea {
  id?: number;
  area?: language;
  time?: language;
}
