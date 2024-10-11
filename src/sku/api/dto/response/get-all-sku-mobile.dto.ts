import { constructFileUrl } from 'package/utils/methods';
import { Sku } from 'src/sku/data/sku.schema';

export class GetByCriteriaSkuMobileResponse {
  id: number;
  quantity: number;
  price: number;
  image: string;

  constructor({ sku, languageKey }: { sku: Sku; languageKey: string }) {
    this.id = sku.id;
    this.image = constructFileUrl(sku.image.key);
    this.price = sku.price;
    this.quantity = sku.quantity;
  }

  toObject(): {
    id: number;
    quantity: number;
    price: number;
    image: string;
  } {
    return {
      id: this.id,
      price: this.price,
      quantity: this.quantity,
      image: this.image,
    };
  }
}
