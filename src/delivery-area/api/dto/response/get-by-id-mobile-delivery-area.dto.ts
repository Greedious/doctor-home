import { DeliveryArea } from 'src/delivery-area/data/delivery-area.schema';

export class GetByIdMobileDeliveryAreaResponse {
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
    this.area = deliveryArea.area[languageKey || 'ar'];
    this.time = deliveryArea.time[languageKey || 'ar'];
    // this.image = deliveryArea.image;
  }

  toObject(): {
    id: number;
    area?: string;
    time: string;
  } {
    return {
      id: this.id,
      area: this.area,
      time: this.time,
    };
  }
}
