import { language } from 'package/utils/language/language';
import { DeliveryArea } from 'src/delivery-area/data/delivery-area.schema';

export class GetByCriteriaDeliveryAreaResponse {
  id: number;
  area: language;
  time: language;

  constructor({
    deliveryArea,
    languageKey,
  }: {
    deliveryArea: DeliveryArea;
    languageKey: string;
  }) {
    this.id = deliveryArea.id;
    this.area = deliveryArea.area;
    this.time = deliveryArea.time;
  }

  toObject(): {
    id: number;
    area: language;
    time: language;
  } {
    return {
      id: this.id,
      area: this.area,
      time: this.time,
    };
  }
}
