import { language } from 'package/utils/language/language';
import { DeliveryArea } from 'src/delivery-area/data/delivery-area.schema';

export class GetByCriteriaDeliveryAreaMobileResponse {
  id: number;
  area: string;
  time: string;

  constructor({
    deliveryArea,
    languageKey,
  }: {
    deliveryArea: DeliveryArea;
    languageKey: string;
  }) {
    this.id = deliveryArea.id;
    this.area = deliveryArea.area[languageKey];
    this.time = deliveryArea.time[languageKey];
  }

  toObject(): {
    id: number;
    area: string;
    time: string;
  } {
    return {
      id: this.id,
      area: this.area,
      time: this.time,
    };
  }
}
